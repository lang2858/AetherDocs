# .ae 绑定语法

`.ae` 文件中的绑定语法是 UI 与 Rust 逻辑层交互的核心接口。本文档详细说明 `{TypeName.field}` 数据绑定、`onClick={Type.method()}` 事件分发、TextField 双向绑定的写法和规则。

---

## 1. 数据绑定 `{TypeName.field}`

### 1.1 基本语法

在 `.ae` 文件中，用 `{TypeName.field}` 语法读取 Rust 状态：

```ae
Text({Editor.activeContent})
Text({Home.projectDir})
```

**解析规则**：
- `TypeName` — Rust struct 名称（如 `Editor`、`Home`、`EditorState`）
- `field` — 对应 Rust 方法生成的属性名（camelCase）
- `TypeName` 决定了数据来源：有 Manager 的类型从 Manager 读，当前页面逻辑类型从 ViewModel 读

### 1.2 类型路由

| TypeName 匹配 | 数据来源 | Swift 生成 |
|---------------|---------|-----------|
| 有对应 Manager 的类型 | Manager 的 @Published 属性 | `editorManager.activeContent` |
| 当前页面的 logic 类型 | ViewModel 的 logic 属性 | `viewModel.logic.getProjectDir()` |

**注意**：`Editor` 和 `EditorState` 都会被路由到 `editorManager`，因为 Manager 名是 `EditorStateManager`，翻译器通过名称匹配来确定关联。

### 1.3 支持的绑定上下文

数据绑定可以出现在：

| 位置 | 示例 | Swift 生成 |
|------|------|-----------|
| Text 内容 | `Text({Editor.activeContent})` | `Text(editorManager.activeContent)` |
| 条件判断 | `If(condition={Editor.hasErrors})` | 直接引用 Manager 属性 |
| 组件属性 | `visible={Editor.hasErrors}` | `.opacity(editorManager.hasErrors ? 1 : 0)` |
| 列表数据源 | `ForEach(items={Editor.openFiles})` | `ForEach(editorManager.openFiles, id: \.self)` |

---

## 2. 事件绑定 `onXxx={TypeName.method()}`

### 2.1 语法格式

事件绑定使用花括号包裹的 Rust 方法调用：

```ae
Button("点击" onClick={Home.on_click()})
View(onTap={Detail.show_menu()})
Toggle(value={Settings.dark_mode} onChange={Settings.toggle_dark()})
```

### 2.2 分发规则

花括号内 `TypeName.method()` 的 `TypeName` 决定路由目标：

| TypeName 匹配 | Swift 生成 | 说明 |
|---------------|-----------|------|
| 有 Manager 的类型 | `editorManager.onClick()` | 路由到对应 Manager |
| 当前页面 logic 类型 | `viewModel.logic.onClick()` | 路由到 ViewModel |
| 未匹配 | 验证报错 (E020) | 绑定无效 |

### 2.3 带参数的 Action

Rust 方法的参数从 AE 组件属性中传递：

```rust
// Rust 侧
pub fn open_file(&mut self, path: String) { ... }
```

```ae
// AE 侧
Button("打开" onClick={Home.open_file("config.toml")})
```

---

## 3. TextField 双向绑定

### 3.1 绑定语法

```ae
TextField(value={Editor.activeContent} placeholder="输入内容")
```

### 3.2 绑定解析

翻译器解析 `{TypeName.field}` 中的 `TypeName` 来确定双向绑定目标：

| TypeName | Swift 绑定 | 说明 |
|----------|-----------|------|
| `Editor` / `EditorState` | `$editorManager.activeContent` | Manager 的 Binding |
| 其他有 Manager 的类型 | `$typeManager.field` | 对应 Manager 的 Binding |
| 当前页面的 logic 类型 | `$viewModel.field` | ViewModel 的 @Published 属性 |

---

## 4. Manager 变量名映射

翻译器内部维护类型名到 Swift 变量名的映射：

| Rust 类型名 | Swift Manager 变量名 | Manager 类名 |
|------------|---------------------|-------------|
| `EditorState` | `editorManager` | `EditorStateManager` |
| `Home` | `homeManager` | `HomeManager` |
| `AppSettings` | `appSettingsManager` | `AppSettingsManager` |

**映射规则**：`TypeName` → camelCase + `Manager` 后缀 → `typeNameManager`

---

## 5. 完整绑定示例

### .ae 文件

```ae
VStack(spacing=12) {
    // 数据绑定：显示状态
    Text({Editor.activeFileName}).size(16).bold()

    // TextField 双向绑定
    TextField(value={Editor.activeContent} placeholder="输入内容")

    // 事件绑定
    Button("打开文件" onClick={Editor.open_file("main.rs")})
    Button("保存" onClick={Editor.save_file()})

    // 调用页面逻辑方法
    Button("刷新" onClick={Home.refresh_data()})

    // 条件显示
    If(condition={Editor.hasErrors}) {
        Text("有错误").color($colors.error)
    }
}
```

### 生成的 Swift 代码（概要）

```swift
VStack(spacing: 12) {
    Text(editorManager.activeFileName).font(.system(size: 16)).bold()
    TextField("输入内容", text: $editorManager.activeContent)

    Button("打开文件") { editorManager.openFile(path: "main.rs") }
    Button("保存") { editorManager.saveFile() }

    Button("刷新") { viewModel.logic.refreshData() }

    if editorManager.hasErrors {
        Text("有错误").foregroundColor(AppColors.error)
    }
}
.onAppear { editorManager.subscribeObserver() }
```

---

## 6. 常见错误与避坑

| 错误写法 | 原因 | 正确写法 |
|---------|------|---------|
| `{EditorState.activeFile}` | TypeName 应该用简短名 `Editor` | `{Editor.activeFile}` |
| `onClick=open_file("path")` | 缺少花括号和 TypeName | `onClick={Home.open_file("path")}` |
| `{editor.activeContent}` | TypeName 必须大写开头 | `{Editor.activeContent}` |
| `TextField("{Editor.activeContent}")` 但 ViewModel 无该属性 | 需要确保翻译器能发现该绑定 | 检查 Rust 方法签名 |

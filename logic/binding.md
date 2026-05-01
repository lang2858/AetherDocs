# .ae 绑定语法

`.ae` 文件中的绑定语法是 UI 与 Rust 逻辑层交互的核心接口。本文档详细说明 `{TypeName.field}` 数据绑定、`.click()` 事件分发、TextField 双向绑定的写法和规则。

---

## 1. 数据绑定 `{TypeName.field}`

### 1.1 基本语法

在 `.ae` 文件中，用 `{TypeName.field}` 语法读取 Rust 状态：

```ae
Text("{Editor.activeContent}")
Text("{Home.projectDir}")
```

**解析规则**：
- `TypeName` — Rust struct 名称（如 `Editor`、`Home`、`EditorState`）
- `field` — Swift Manager 上的 @Published 属性名（camelCase）
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
| Text 内容 | `Text("{Editor.activeContent}")` | `Text(editorManager.activeContent)` |
| 条件判断 | `if editorMode == "code"` | 直接引用 Manager 属性 |
| 组件属性 | `visible="{Editor.hasErrors}"` | `.opacity(editorManager.hasErrors ? 1 : 0)` |
| 列表数据源 | `ForEach("{Editor.openFiles}")` | `ForEach(editorManager.openFiles, id: \.self)` |

---

## 2. `.click()` 事件分发

### 2.1 语法格式

```ae
.click(action=methodName)
.click(action=TypeName.methodName)
```

### 2.2 分发规则

`.click()` 的 `action` 参数支持三种写法，按优先级匹配：

#### 格式一：`TypeName.method`（推荐 — 显式指定目标）

```ae
.click(action=Editor.setActiveFile)
.click(action=Home.on_click)
.click(action=Settings.switch_theme)
```

**匹配逻辑**（`resolve_click_action` 函数）：

1. 遍历所有已知的状态类型（从 `rust_extractor` 提取的模块信息）
2. 如果 `TypeName` 匹配某个状态类型，且该类型有 `methodName` 方法：
   - 如果该类型有 Manager → 生成 `xxxManager.methodName()`
   - 如果该类型是当前页面的 logic → 生成 `viewModel.logic.methodName()`
3. 如果 `TypeName` 不匹配任何已知类型 → 回退到默认 editorManager

#### 格式二：`methodName`（无前缀 — 向后兼容）

```ae
.click(action=setActiveFile)
.click(action=openFile)
```

**匹配逻辑**：

1. 查找 `methodName` 在哪个状态类型中存在
2. 如果只在 EditorState 中找到 → `editorManager.methodName()`
3. 如果在多个类型中找到 → 优先匹配 EditorState（向后兼容）
4. 如果未找到 → 回退到 `editorManager.methodName()`（保持旧行为）

### 2.3 带参数的 click

当前 `.click()` 不支持直接传参数。Action 方法必须是**无参**的：

```rust
// 可以被 .click() 调用
pub fn on_click(&mut self) { ... }

// 不能直接被 .click() 调用（有参数）
pub fn open_file(&mut self, path: &str) { ... }
```

**变通方案**：对于需要参数的操作，使用 TextField 绑定 + 确认按钮模式：

1. TextField 绑定一个临时输入字段
2. `.click()` 调用无参方法，方法内部从临时字段读取值

### 2.4 特殊 click 生成

翻译器为常见操作生成便利方法：

| .ae 写法 | Swift 生成 |
|---------|-----------|
| `.click(action=setEditorModeCode)` | `editorManager.setEditorModeCode()` |
| `.click(action=setEditorModeDesign)` | `editorManager.setEditorModeDesign()` |
| `.click(action=activateTab0)` | `editorManager.activateTab0()` |
| `.click(action=closeTab0)` | `editorManager.closeTab0()` |

这些便利方法由 Manager 自动生成，不需要在 Rust 中定义。

---

## 3. TextField 双向绑定

### 3.1 绑定语法

```ae
TextField("{Editor.activeContent}")
```

### 3.2 绑定解析

翻译器解析 `"{TypeName.field}"` 中的 `TypeName` 来确定绑定目标：

| TypeName | Swift 绑定 | 说明 |
|----------|-----------|------|
| `Editor` / `EditorState` | `editorManager.$activeContent` | Manager 的 Binding |
| 其他有 Manager 的类型 | `{typeVar}.$field` | 对应 Manager 的 Binding |
| 当前页面的 logic 类型 | `viewModel.$field` | ViewModel 的 @Published 属性 |

**注意**：TextField 绑定使用 `$` 前缀语法（SwiftUI `Binding`），这意味着：
- 对于 Manager 绑定，Manager 上必须有对应的 `@Published var field`
- 对于 ViewModel 绑定，ViewModel 上必须有对应的 `@Published var field`

### 3.3 ViewModel @Published 自动生成

当 `.ae` 文件中使用了 `{TypeName.field}` 且 `TypeName` 对应当前页面的逻辑类型时，翻译器会自动在 ViewModel 上生成对应的 `@Published` 属性：

```swift
class HomeViewModel: ObservableObject {
    let logic: Home
    @Published var searchText: String = ""  // 自动生成

    init() {
        self.logic = Home()
    }

    func syncFromLogic() {
        searchText = logic.getSearchText()
    }
}
```

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
VStack {
    // 数据绑定：显示 Editor 状态
    Text("{Editor.activeFileName}")

    // TextField 双向绑定
    TextField("{Editor.activeContent}")

    // click 分发：显式指定目标
    Button("Open") .click(action=Editor.openFile)
    Button("Close") .click(action=Editor.closeFile)

    // click 分发：无前缀（向后兼容）
    Button("Save") .click(action=saveFile)

    // click 分发：调用页面逻辑
    Button("Refresh") .click(action=Home.on_click)

    // 条件显示
    if editorMode == "code" {
        Text("Code Mode")
    }
}
```

### 生成的 Swift 代码（概要）

```swift
VStack {
    Text(editorManager.activeFileName)
    TextField("", text: editorManager.$activeContent)

    Button("Open") { editorManager.openFile() }
    Button("Close") { editorManager.closeFile() }

    Button("Save") { editorManager.saveFile() }
    Button("Refresh") { viewModel.logic.on_click() }

    if editorManager.editorMode == .code {
        Text("Code Mode")
    }
}
.onAppear { editorManager.subscribeObserver() }
```

---

## 6. 常见错误与避坑

| 错误写法 | 原因 | 正确写法 |
|---------|------|---------|
| `{EditorState.activeFile}` | TypeName 应该用简短名 `Editor` | `{Editor.activeFile}` |
| `.click(action=openFile("path"))` | click 不支持传参 | 用 TextField 绑定 + 无参 click |
| `{editor.activeContent}` | TypeName 必须大写开头 | `{Editor.activeContent}` |
| `TextField("{Editor.activeContent}")` 但 ViewModel 无该属性 | ViewModel 需要自动生成 @Published | 确保翻译器能发现该绑定 |

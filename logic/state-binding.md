# State Binding & Logic Layer

Aether 的核心设计：UI 声明状态依赖，Logic 层管理业务逻辑，框架自动桥接两者。

## 状态绑定 ($state)

在 AE view 中使用 `$state` 声明响应式状态：

```ae
view Counter {
    $count: Int = 0

    HStack {
        Button("-") { $count -= 1 }
        Text("{count}")
        Button("+") { $count += 1 }
    }
}
```

框架自动生成：
- `@Published var count: Int = 0` 在 ViewModel 中
- SwiftUI 视图自动响应变化

## 逻辑层调用 ($logic)

Rust `logic.rs` 定义业务逻辑，AE 通过 `$logic.method()` 调用：

```rust
// src/logic/home_logic.rs
pub struct HomeLogic {
    src_path: String,
}

impl HomeLogic {
    pub fn get_src_path(&self) -> String { self.src_path.clone() }
    pub fn scan_files(&mut self, path: &str) -> Vec<FileItem> { ... }
}
```

```ae
// AE 中调用
:file_tree(path=$logic.get_src_path())
```

### 调用流程

```
AE: $logic.scan_files("./src")
  ↓ codegen 生成
Swift: viewModel.logic.scanFiles("./src")
  ↓ UniFFI 桥接
Rust: home_logic.rs → HomeLogic::scan_files()
  ↓ 返回值
Swift: [FileItem] → 更新 @Published → UI 刷新
```

## 组件参数传递

组件调用时 props 自动映射为 ViewModel 字段：

```ae
:project_navigator(src_path=$logic.getSrcPath(), gen_path=$logic.getGenPath())
```

生成代码：
- `ProjectNavigatorViewModel` 包含 `srcPath`, `genPath` 字段
- 父组件传入值自动赋值到子组件 ViewModel

## 跨层级状态

通过 `$state` 在父 view 声明，子组件通过 props 接收：

```ae
view Home {
    $selected_file: String = ""

    HStack {
        :file_tree(path=$logic.getSrcPath(), on_select=$selected_file)
        :editor(file=$selected_file)
    }
}
```

## 双向绑定

使用 `{$binding}` 语法实现双向绑定：

### 页面级状态绑定

```ae
TextField(value={$search_query})
```

- 输入变化自动更新 ViewModel 的 `$search_query` 状态
- 状态变化自动反映到 UI

### StateManager 状态绑定

当绑定的类型有 StateManager 时，双向绑定会路由到对应 Manager：

```ae
TextField(value={Editor.file_content} placeholder="输入代码...")
```

- `Editor` 类型 → 查找 `EditorStateManager` → 生成 `editorManager.$file_content`
- 输入变化自动更新 `EditorStateManager.fileContent`
- StateManager 的 `@Published` 属性变化自动反映到 UI

生成的 Swift 代码：

```swift
TextField("输入代码...", text: editorManager.$fileContent)
```

无 StateManager 的类型（如 `Home`）则路由到 ViewModel：

```ae
TextField(value={Home.search_query})
```

```swift
TextField("", text: viewModel.$searchQuery)
```

---

## 交互路由 (.click)

`.click()` 修饰符支持类型前缀路由，自动分发到 StateManager 或 Logic 层：

| AE 语法 | 路由目标 | 生成的 Swift 代码 |
|---------|---------|-------------------|
| `.click(action=open_file)` | 默认 Manager | `editorManager.openFile()` |
| `.click(action=Editor.open_file)` | StateManager | `editorManager.openFile()` |
| `.click(action=Home.refresh)` | Logic 层 | `viewModel.logic.refresh()` |

```ae
Text("打开文件").click(action=Editor.open_file)
```

```swift
Text("打开文件").onTapGesture { editorManager.openFile() }
```

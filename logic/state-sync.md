# 状态同步机制

Aether 的状态同步基于 **Rust ↔ Swift 双向通信**架构。Swift 通过 Manager 读取 Rust 状态，Rust 通过推送通知主动通知 Swift 状态变更。

---

## 1. StateManager 自动生成

每个被 `.ae` 文件引用的 Rust 状态类型，都会自动生成对应的 Swift StateManager。

### 1.1 哪些类型会生成 Manager

当前规则：
- **EditorState** 始终生成 Manager（向后兼容）
- 其他类型通过扫描 `.ae` 文件中的 `{TypeName.field}` 和 `.click(action=TypeName.method)` 绑定来确定

### 1.2 Manager 生成内容

对于 Rust 类型 `EditorState`，自动生成 `EditorStateManager.swift`，包含：

| 部分 | 内容 | 来源 |
|------|------|------|
| @Published 属性 | 每个 getter 对应一个属性 | Rust `&self` 无参有返回值的方法 |
| Rust 实例 | `private let state = EditorState()` | UniFFI 导出的构造器 |
| Action 方法 | 调 Rust + `refreshFromRust()` | Rust `&mut self` 方法 |
| refreshFromRust | 读所有 getter 同步 @Published | 所有 getter 方法 |
| refreshFields | 增量刷新指定属性 | 推送通知时使用 |
| subscribeObserver | 总是生成；有 delegate 时注册 Observer，无 delegate 时为空方法 | 自动订阅 |
| Observer 类 | 符合 callback_interface 的通知接收者 | 仅类型有 StateChangeDelegate 时生成 |

### 1.3 Manager 类结构示例

```swift
class EditorStateManager: ObservableObject {
    static let shared = EditorStateManager()

    // 1. @Published 属性 — 从 Rust getter 映射
    @Published var openFiles: [String] = []
    @Published var activeFile: String = ""
    @Published var activeContent: String = ""
    @Published var editorMode: EditorMode = .code
    @Published var cursorLine: UInt32 = 0
    @Published var cursorCol: UInt32 = 0
    @Published var errorCount: UInt32 = 0
    @Published var warningCount: UInt32 = 0

    // 2. Rust 实例
    private let state = EditorState()

    // 3. Action 方法 — 调 Rust mutating 方法 + 全量 refresh
    func openFile(path: String) {
        state.openFile(path: path)
        refreshFromRust()
    }

    func setEditorMode(mode: EditorMode) {
        state.setEditorMode(mode: mode)
        refreshFromRust()
    }

    // 4. 全量 refresh — 读取所有 getter
    private func refreshFromRust() {
        activeFile = state.getActiveFile() ?? ""
        openFiles = state.getOpenFiles()
        activeContent = state.getActiveContent()
        // ... 每个 getter 对应一行
    }

    // 5. 增量 refresh — 只刷新指定字段
    private func refreshFields(_ fields: Set<String>) {
        if fields.contains("activeFile") {
            activeFile = state.getActiveFile() ?? ""
        }
        if fields.contains("openFiles") {
            openFiles = state.getOpenFiles()
        }
        // ...
    }

    // 6. 推送通知接收
    func onStateChanged(fields: [String]) {
        let fieldSet = Set(fields)
        refreshFields(fieldSet)
    }

    func subscribeObserver() {
        setStateChangeObserver(observer: EditorStateObserver(manager: self))
    }
}

// 7. Observer 类
class EditorStateObserver: EditorStateStateChangeDelegate {
    private weak var manager: EditorStateManager?
    init(manager: EditorStateManager) { self.manager = manager }
    func onFieldsChanged(fields: [String]) {
        DispatchQueue.main.async { [weak self] in
            self?.manager?.onStateChanged(fields: fields)
        }
    }
}
```

---

## 2. Getter/Action 映射规则

### 2.1 Getter → @Published 属性

映射过程：

| Rust getter | Swift @Published 属性 |
|-------------|---------------------|
| `get_active_file(&self) -> Option<String>` | `@Published var activeFile: String = ""` |
| `get_open_files(&self) -> Vec<String>` | `@Published var openFiles: [String] = []` |
| `get_cursor_line(&self) -> u32` | `@Published var cursorLine: UInt32 = 0` |
| `get_editor_mode(&self) -> EditorMode` | `@Published var editorMode: EditorMode = .code` |

**命名转换规则**：
- `get_xxx` → 去掉 `get_` 前缀 → `xxx` → snake_case 转 camelCase → `xxxYyy`
- `get_active_file` → `active_file` → `activeFile`

**类型转换规则**：
- Rust `Option<T>` → Swift `T?`，refresh 时用 `?? defaultValue` 处理 nil
- Rust `Vec<T>` → Swift `[T]`
- Rust 基础类型 → Swift 对应类型（见 [writing-rust.md](writing-rust.md) 类型表）
- Rust 自定义 Enum → Swift 同名 Enum（需要 switch 处理）

**默认值规则**：
- `String` → `""`
- `Bool` → `false`
- 整数类型 → `0`
- 浮点类型 → `0.0`
- `Option` → `nil`
- 数组 → `[]`
- 已知 Enum → 第一个变体（如 `EditorMode` → `.code`）
- 其他 → `.init()`

### 2.2 Action → Manager 方法

所有非 getter、非构造器、有 `self` 参数的方法映射为 Manager 的公开方法：

```rust
// Rust
pub fn open_file(&mut self, path: &str) { ... }
pub fn set_editor_mode(&mut self, mode: EditorMode) { ... }
```

```swift
// Swift Manager
func openFile(path: String) {
    state.openFile(path: path)
    refreshFromRust()
}
func setEditorMode(mode: EditorMode) {
    state.setEditorMode(mode: mode)
    refreshFromRust()
}
```

**每个 Action 方法内部流程**：调 Rust 方法 → `refreshFromRust()` → SwiftUI 检测 @Published 变化 → UI 更新。

### 2.3 自由函数 → Manager 方法

模块级自由函数会被关联到该模块主 struct 的 Manager：

```rust
// Rust 自由函数
pub fn format_line_number(line: u32) -> String { ... }
```

```swift
// EditorStateManager 上
func formatLineNumber(line: UInt32) -> String {
    return formatLineNumber(line: line)
}
```

注意：自由函数不触发 `refreshFromRust()`，因为没有修改状态。

---

## 3. 全量 vs 增量刷新

### 3.1 全量刷新 (refreshFromRust)

每次 Action 方法调用后，自动执行全量刷新——读取所有 getter 并更新所有 @Published 属性。

**适用场景**：UI 操作触发的状态变更（`.click()` → Manager 方法 → refreshFromRust）

**性能影响**：每次操作都读所有 getter，对于少量字段没问题，字段很多时可能有性能开销。

### 3.2 增量刷新 (refreshFields)

只刷新指定的字段集合：

```swift
private func refreshFields(_ fields: Set<String>) {
    if fields.contains("activeFile") {
        activeFile = state.getActiveFile() ?? ""
    }
    if fields.contains("openFiles") {
        openFiles = state.getOpenFiles()
    }
    // 只刷新 fields 中包含的字段
}
```

**适用场景**：推送通知触发的状态变更（Rust 异步通知 → `onStateChanged(fields:)` → refreshFields）

---

## 4. 推送通知机制 (Rust → Swift)

### 4.1 原理

Rust 侧定义 `callback_interface` trait，Swift 侧通过 Observer 类实现该 trait。当 Rust 侧状态异步变更时，调用 `notify_*_fields_changed` 函数，通知 Swift 侧只刷新受影响的字段。

### 4.2 Rust 侧代码（自动生成）

翻译器为每个状态类型自动生成三部分代码，放入 `lib.rs`：

```rust
// 1. callback_interface trait
#[uniffi::export(callback_interface)]
pub trait EditorStateStateChangeDelegate: Send + Sync {
    fn on_fields_changed(&self, fields: Vec<String>);
}

// 2. 全局委托存储
static mut EDITORSTATE_STATE_CHANGE_DELEGATE: Option<Box<dyn EditorStateStateChangeDelegate>> = None;

// 3. 设置观察者
#[uniffi::export]
pub fn set_editor_state_state_change_observer(observer: Box<dyn EditorStateStateChangeDelegate>) {
    unsafe {
        EDITORSTATE_STATE_CHANGE_DELEGATE = Some(observer);
    }
}

// 4. 推送通知函数 — Rust 侧调用此函数通知 Swift
#[uniffi::export]
pub fn notify_editor_state_fields_changed(fields: Vec<String>) {
    unsafe {
        if let Some(observer) = &EDITORSTATE_STATE_CHANGE_DELEGATE {
            observer.on_fields_changed(fields);
        }
    }
}
```

### 4.3 Swift 侧代码（自动生成）

```swift
// Observer 类 — 实现 Rust 的 callback_interface
class EditorStateObserver: EditorStateStateChangeDelegate {
    private weak var manager: EditorStateManager?
    init(manager: EditorStateManager) { self.manager = manager }
    func onFieldsChanged(fields: [String]) {
        DispatchQueue.main.async { [weak self] in
            self?.manager?.onStateChanged(fields: fields)
        }
    }
}
```

### 4.4 使用方式

**自动订阅**：App 入口 `.onAppear` 中自动为所有 StateManager 调用 `subscribeObserver()`，无需手动添加。

```swift
// 自动生成的 App 入口
.onAppear {
    HomeManager.shared.subscribeObserver()
    EditorStateManager.shared.subscribeObserver()
    ConsoleManager.shared.subscribeObserver()
    // ... 所有 state_manager_names 中的类型
}
```

**有 StateChangeDelegate 的类型**：`subscribeObserver()` 注册真正的 Observer，接收推送通知。

**无 StateChangeDelegate 的类型**：`subscribeObserver()` 是空方法（no-op），保证框架层面 API 统一。

**Rust 侧推送**（在异步操作完成后）：

```rust
notify_editor_state_fields_changed(vec![
    "activeContent".to_string(),
    "errorCount".to_string(),
]);
```

**注意**：
- 推送的字段名是 Swift 属性名（camelCase），不是 Rust getter 名
- 例如：Rust getter `get_active_content` → Swift 属性 `activeContent` → 推送 `"activeContent"`
- `notify_*` 函数使用 `unsafe` 全局存储，确保在单线程场景下安全

### 4.5 多 Manager 推送通知

每个状态类型都有独立的推送通知通道：

| Rust 类型 | 设置观察者函数 | 推送通知函数 |
|-----------|-------------|-------------|
| `EditorState` | `set_editor_state_state_change_observer` | `notify_editor_state_fields_changed` |
| `Home` | `set_home_state_change_observer` | `notify_home_fields_changed` |
| `AppSettings` | `set_app_settings_state_change_observer` | `notify_app_settings_fields_changed` |

---

## 5. 数据流总览

```
用户操作 (.click)
    ↓
Swift Manager.Action()
    ↓
Rust mutating method (通过 UniFFI)
    ↓
Swift refreshFromRust() (全量同步)
    ↓
SwiftUI @Published 变化 → UI 更新

────────────────────────────────

Rust 异步变更 (后台线程)
    ↓
notify_*_fields_changed(["field1", "field2"])
    ↓
Swift Observer.onFieldsChanged()
    ↓
DispatchQueue.main.async → Manager.onStateChanged()
    ↓
Swift refreshFields(["field1", "field2"]) (增量同步)
    ↓
SwiftUI @Published 变化 → UI 更新
```

---

## 6. 性能考虑

1. **全量刷新**适用于 UI 操作触发的即时变更——操作频率低，延迟要求高
2. **增量刷新**适用于 Rust 异步推送——变更频率可能高，需要减少不必要的 getter 调用
3. **避免在 getter 中做耗时计算**——每次 refresh 都会调用所有 getter
4. **大数组类型的 getter** 可能造成性能瓶颈——考虑只传索引/长度，数据按需加载
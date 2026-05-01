# Rust 代码编写规则

Aether Logic 层的开发者只写**纯 Rust 代码**，翻译器 (`aether trans`) 自动完成 UniFFI 注解、Mutex 包装、跨模块导出、Swift Manager 生成等所有桥接工作。

---

## 1. 文件与命名约定

| 规则 | 说明 | 示例 |
|------|------|------|
| 一个 `.rs` 文件 = 一个页面/功能 | 文件名与 `.ae` 文件对应 | `home.rs` ↔ `home.ae` |
| 主 struct 名 = PascalCase 页面名 | 文件中第一个 pub struct 视为主类型 | `Home`、`EditorState` |
| 方法名 = snake_case | 标准 Rust 命名 | `open_file`、`get_active_content` |
| 枚举变体 = PascalCase | 标准 Rust 命名 | `EditorMode::Code` |
| Manager 名 = `{StructName}Manager` | 自动生成，开发者无需关心 | `EditorStateManager` |

文件放置位置：`src/logic/{name}.rs`

---

## 2. Struct 写法

### 2.1 带 impl 的 Struct（状态对象）

拥有 `impl` 块的 `pub struct` 会被翻译为 UniFFI Object，自动包装 `Mutex`：

```rust
// 开发者写的
pub struct EditorState {
    open_files: Vec<String>,
    active_file: Option<String>,
    editor_mode: EditorMode,
}

// 翻译器自动转换为：
#[derive(uniffi::Object)]
pub struct EditorState { inner: std::sync::Mutex<EditorStateInner> }
struct EditorStateInner {
    open_files: Vec<String>,
    active_file: Option<String>,
    editor_mode: EditorMode,
}
```

**规则**：
- 所有字段必须是私有的（不加 `pub`）
- 翻译器自动为每个字段生成 `get_{field_name}(&self)` getter
- 不需要手动写 getter，除非需要自定义逻辑
- 构造器必须是 `pub fn new() -> Self`

### 2.2 不带 impl 的 Struct（数据记录）

没有 `impl` 块的 `pub struct` 会被翻译为 UniFFI Record：

```rust
// 开发者写的
pub struct DiagnosticInfo {
    pub severity: String,
    pub message: String,
    pub line: u32,
}

// 翻译器自动添加：
#[derive(Clone, uniffi::Record)]
pub struct DiagnosticInfo { ... }
```

**规则**：
- Record struct 的字段**必须**加 `pub`，否则 UniFFI 无法导出
- Record struct 必须 derive `Clone`（翻译器自动添加）
- Record 用于纯数据传递，不含业务逻辑

### 2.3 已有 inner Mutex 模式的 Struct（手动 UniFFI 标注）

如果开发者已经手动写了 `inner: Mutex<NameInner>` 模式，翻译器**不会**重复包装：

```rust
// 开发者手动写的（高级用法）
pub struct EditorState {
    inner: std::sync::Mutex<EditorStateInner>,
}
struct EditorStateInner {
    open_files: Vec<String>,
    // ...
}
```

翻译器只补充 `#[derive(uniffi::Object)]`（如果缺失），不做字段变换。

---

## 3. Enum 写法

```rust
// 开发者写的
pub enum EditorMode {
    Code,
    Preview,
    Design,
}

// 翻译器自动添加：
#[derive(Clone, uniffi::Enum)]
pub enum EditorMode { ... }
```

**规则**：
- 枚举变体必须是 PascalCase
- 翻译器自动添加 `Clone` 和 `uniffi::Enum` derive
- 支持 Unit 变体和带数据变体：

```rust
pub enum DiffResult {
    NoChange,
    Added { content: String },
    Modified { old: String, new: String },
    Deleted { content: String },
}
```

- 如果已手动添加 `uniffi` 相关 derive/macro，翻译器不会重复添加

---

## 4. impl 块写法

### 4.1 构造器

构造器**必须是** `pub fn new() -> Self`：

```rust
impl EditorState {
    pub fn new() -> Self {
        Self {
            open_files: Vec::new(),
            active_file: None,
            editor_mode: EditorMode::Code,
        }
    }
}
```

翻译器自动：
1. 添加 `#[uniffi::constructor]`
2. 将 `Self { field: val }` 重写为 `Self { inner: std::sync::Mutex::new(EditorStateInner { field: val }) }`

**注意**：当前构造器不支持参数。如果需要初始化参数，使用以下模式：

```rust
pub fn new() -> Self {
    Self { count: 0, name: String::new() }
}

pub fn with_count(count: i32) -> Self {
    Self { count, name: String::new() }
}
```

### 4.2 &mut self 方法（修改状态）

```rust
pub fn open_file(&mut self, path: &str) {
    self.active_file = Some(path.to_string());
    self.open_files.push(path.to_string());
}
```

翻译器自动：
1. 将 `&mut self` 改为 `&self`
2. 在方法体前插入 `let mut inner = self.inner.lock().unwrap();`
3. 将方法体中的 `self.field` 替换为 `inner.field`

**重要限制**：方法体中避免使用 `self.inner`，因为翻译器会将 `self.` 替换为 `inner.`，导致 `self.inner` 变成 `inner.inner`（实际也不应该直接访问 inner）。

### 4.3 &self 方法（读取状态）

```rust
pub fn get_active_content(&self) -> String {
    self.active_file.as_ref()
        .and_then(|f| self.file_contents.get(f))
        .cloned()
        .unwrap_or_default()
}
```

翻译器自动插入 `let inner = self.inner.lock().unwrap();` 并替换 `self.` → `inner.`。

### 4.4 静态方法（无 self 参数）

```rust
pub fn format_line_number(line: u32) -> String {
    format!("{:>4}", line)
}
```

静态方法会被放入单独的非导出 `impl` 块，不会暴露给 Swift。

### 4.5 Trait 实现（Display、Debug 等）

```rust
impl std::fmt::Display for DiffOp {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}
```

Trait 实现块会被原样保留，不会被 UniFFI 导出。

---

## 5. 自由函数

模块级 `pub fn` 会被翻译器自动添加 `#[uniffi::export]`，暴露给 Swift：

```rust
// 开发者写的
pub fn apply_diff(old: &str, new: &str) -> Vec<DiffOp> {
    // ...
}

// 翻译器自动添加：
#[uniffi::export]
pub fn apply_diff(old: &str, new: &str) -> Vec<DiffOp> { ... }
```

**规则**：
- 自由函数签名中只能使用 UniFFI 兼容类型
- 如果已有 `#[uniffi::export]`，翻译器不会重复添加
- 自由函数会被关联到模块的主 struct 的 Swift Manager 上

---

## 6. 方法分类规则

翻译器/代码生成器根据以下规则区分方法类型：

| 类型 | 判定条件 | Swift 侧处理 |
|------|---------|-------------|
| **Getter** | `&self`，有返回值（非 Unit），无额外参数，方法名不以 `on_` 开头 | 生成 `@Published` 属性 |
| **Action** | `&mut self` 或 `&self` 返回 Unit | 生成 Manager 方法，调用后 refresh |
| **构造器** | 方法名为 `new` | 标记 `#[uniffi::constructor]` |
| **自由函数** | 无 `self` 参数 | 通过 Manager 暴露为关联函数 |

### Getter 判定细节

一个方法被识别为 Getter 必须同时满足：
1. 接收者类型为 `&self`（不可变引用）
2. 有返回值且返回值不是 `()`
3. 方法名**不以** `on_` 开头（`on_` 前缀方法被视为事件处理器，不是 getter）
4. **没有额外参数**（只有 `&self`，不接受其他参数）

```rust
// 是 Getter
pub fn get_count(&self) -> i32 { self.count }
pub fn active_file(&self) -> Option<String> { self.active_file.clone() }

// 不是 Getter（有额外参数）
pub fn get_file_content(&self, path: &str) -> String { ... }

// 不是 Getter（返回 Unit）
pub fn log_state(&self) { println!("{:?}", self.count); }

// 不是 Getter（on_ 前缀）
pub fn on_file_changed(&self) -> String { ... }
```

---

## 7. 支持的类型

### 7.1 UniFFI 兼容的基础类型

| Rust 类型 | Swift 类型 | Copy 类型 |
|-----------|-----------|----------|
| `i8` | `Int8` | 是 |
| `i16` | `Int16` | 是 |
| `i32` | `Int32` | 是 |
| `i64` | `Int64` | 是 |
| `i128` | — | 是 |
| `u8` | `UInt8` | 是 |
| `u16` | `UInt16` | 是 |
| `u32` | `UInt32` | 是 |
| `u64` | `UInt64` | 是 |
| `u128` | — | 是 |
| `usize` | `Int` | 是 |
| `isize` | `Int` | 是 |
| `f32` | `Float` | 是 |
| `f64` | `Double` | 是 |
| `bool` | `Bool` | 是 |
| `char` | `Character` | 是 |
| `String` | `String` | 否 |

**Copy 类型的影响**：Copy 类型的 getter 直接返回值（`inner.field`），非 Copy 类型使用 `.clone()`（`inner.field.clone()`）。

### 7.2 容器类型

| Rust 类型 | Swift 类型 |
|-----------|-----------|
| `Vec<T>` | `[T]`（T 需要是 UniFFI 兼容类型） |
| `Option<T>` | `T?` |
| `HashMap<K, V>` | `[K: V]` |
| `&str` | `String`（自动转换） |

### 7.3 自定义类型

Enum 和 Record/Record struct 类型可以直接在签名中使用，翻译器会确保它们被正确导出。

---

## 8. 系统桥接函数

Aether 提供一组 `sys_*` 函数，可在 Rust 方法体中直接调用：

```rust
// Toast 通知
sys_toast("消息内容".to_string(), "info".to_string(), 2.0, "bottom".to_string());

// 对话框
sys_dialog_show("标题".to_string(), "内容".to_string(), "alert".to_string(), "确认".to_string(), "取消".to_string());
sys_dialog_hide();
```

这些函数由翻译器在 `lib.rs` 中通过 delegate trait 提供，不需要 `use` 导入。

---

## 9. 完整示例

```rust
// src/logic/home.rs

pub struct Home {
    project_dir: String,
    file_count: u32,
}

impl Home {
    pub fn new() -> Self {
        Self {
            project_dir: String::new(),
            file_count: 0,
        }
    }

    // Getter: &self + 有返回值 + 无额外参数
    pub fn get_file_count(&self) -> u32 {
        self.file_count
    }

    // Action: &mut self
    pub fn on_click(&mut self) {
        self.file_count += 1;
        sys_toast(
            format!("Count: {}", self.file_count),
            "info".to_string(),
            2.0,
            "bottom".to_string(),
        );
    }

    // 带参数的 Action
    pub fn set_project_dir(&mut self, dir: &str) {
        self.project_dir = dir.to_string();
    }
}
```

翻译后，Swift 侧自动生成 `HomeManager`，包含：
- `@Published var fileCount: UInt32 = 0`
- `func getFileCount() -> UInt32` → getter
- `func onClick()` → 调 Rust + refresh
- `func setProjectDir(dir: String)` → 调 Rust + refresh

---

## 10. Canvas 绘制（DisplayList）

Canvas 组件通过 `onRender` 属性绑定 Rust 方法，Rust 返回 DisplayList JSON 驱动 SwiftUI Canvas 绘制。

### DrawItem 类型

```rust
pub(crate) enum DrawItem {
    Text   { x: f64, y: f64, text: String, font: String, size: f64, color: String, rotation: f64 },
    Rect   { x: f64, y: f64, w: f64, h: f64, fill: Option<String>, border: Option<String>, border_width: f64, radius: f64, rotation: f64 },
    Path   { points: Vec<Vec<f64>>, color: String, width: f64, fill: Option<String> },
    Circle { cx: f64, cy: f64, r: f64, color: String, width: f64, fill: Option<String> },
    Line   { x1: f64, y1: f64, x2: f64, y2: f64, color: String, width: f64 },
}
```

### DisplayList API

```rust
use crate::canvas::{DisplayList, display_list_new, display_list_extend, display_list_render};

let mut list = display_list_new();
display_list_extend(&mut list, vec![DrawItem::Text { /* ... */ }]);
let json = display_list_render(&list); // 序列化 + 调用 sys_canvas_render
```

| 函数 | 签名 | 说明 |
|------|------|------|
| `display_list_new` | `() -> DisplayList` | 创建空 DisplayList |
| `display_list_push` | `(&mut DisplayList, DrawItem)` | 追加单个绘制项 |
| `display_list_extend` | `(&mut DisplayList, Vec<DrawItem>)` | 批量追加绘制项 |
| `display_list_clear` | `(&mut DisplayList)` | 清空 |
| `display_list_render` | `(&DisplayList) -> String` | 序列化为 JSON 并推送到 CanvasRenderer |

### Block 高级抽象

Block 是 DrawItem 之上的语义层，将内容块（文字、AI 回复、代码、涂鸦）渲染为一组 DrawItem：

```rust
use crate::block::{Block, BlockType, BlockContent, SketchPath, Markup, block_render_items, markup_render_items};

let block = Block {
    id: "b1".to_string(),
    block_type: BlockType::Text,
    x: 40.0, y: 60.0, width: 300.0, collapsed: false,
    content: BlockContent::Text {
        text: "标题".to_string(), font: "AetherHand".to_string(), size: 18.0, color: "#3C3C3C".to_string(),
    },
};
display_list_extend(&mut list, block_render_items(&block));
```

| BlockType | BlockContent | 说明 |
|-----------|-------------|------|
| `Text` | `Text { text, font, size, color }` | 文字块，暖色背景 |
| `AiReply` | `AiReply { text, font, size, color }` | AI 回复块，蓝色背景 |
| `Code` | `Code { code, language, summary }` | 代码块，深色背景，支持 collapsed |
| `Sketch` | `Sketch { paths, background }` | 涂鸦块，自由路径 |

Markup 是轻量标注，渲染为 DrawItem 的 Circle/Line/Text：

```rust
let markup = Markup::Circle { cx: 190.0, cy: 80.0, r: 50.0 };
display_list_extend(&mut list, markup_render_items(&markup));
```

| Markup 变体 | 说明 |
|------------|------|
| `Circle { cx, cy, r }` | 红色圆圈标注 |
| `Arrow { x1, y1, x2, y2 }` | 红色箭头线 |
| `Cross { cx, cy, size }` | 红色叉号 |
| `Note { x, y, text }` | 红色手写批注 |

### .ae 绑定

```ae
Canvas(onRender={Home.get_commands}).w(100%).h(400)
```

Rust 侧 `get_commands` 方法返回 `String`（DisplayList JSON），Canvas `onAppear` 时自动调用。

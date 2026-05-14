# Canvas 绘制与 Block 布局

Canvas 组件通过 `onRender` 属性绑定 Rust 方法，Rust 返回 DisplayList JSON 驱动 SwiftUI Canvas 绘制。Block 是 DrawItem 之上的语义层，LayoutEngine 自动计算布局。

---

## DisplayList API

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

### DisplayList 函数

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

### .ae 绑定

```ae
Canvas(onRender={Home.get_commands}).w(100%).h(400)
```

Rust 侧 `get_commands` 方法返回 `String`（DisplayList JSON），Canvas `onAppear` 时自动调用。

---

## Block 语义层

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

### BlockType 与 BlockContent

| BlockType | BlockContent | 说明 |
|-----------|-------------|------|
| `Text` | `Text { text, font, size, color }` | 文字块，暖色背景 |
| `AiReply` | `AiReply { text, font, size, color }` | AI 回复块，蓝色背景 |
| `Code` | `Code { code, language, summary }` | 代码块，深色背景，支持 collapsed |
| `Sketch` | `Sketch { paths, background }` | 涂鸦块，自由路径 |

### Markup 标注

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

---

## Block 自动布局

Block 支持 `parent_id` 树形嵌套，LayoutEngine 自动计算垂直排列位置。

### LayoutEngine

```rust
use crate::layout::{layout_engine_new, layout_blocks, block_height};

let engine = layout_engine_new();
let results = layout_blocks(&engine, &blocks);
// results: Vec<LayoutResult> { block_id, x, y, height, indent_level }
```

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `indent_width` | 24.0 | 每级缩进宽度 |
| `base_x` | 40.0 | 起始 x 坐标 |
| `gap` | 12.0 | Block 间距 |
| `padding_top` | 20.0 | 顶部留白 |

### 树形嵌套

Block 的 `parent_id: Option<String>` 字段指定父 Block：

```rust
let child = Block {
    id: "child1".to_string(),
    parent_id: Some("b1".to_string()),  // 嵌套在 b1 下
    // ...
};
```

- `parent_id = None` → 顶层 Block
- 折叠的 Block：子 Block 不参与布局（自动跳过）
- `indent_level` 由 LayoutEngine 沿 parent 链计算

### 高度估算

`block_height()` 根据内容估算高度：

- Text/AiReply：按字符数估算行数 × size × 1.8
- Code collapsed：36.0，展开：行数 × 20.0 + 24.0
- Sketch：80.0

### 增删方法

Home struct 提供：

| 方法 | 说明 |
|------|------|
| `add_text_block(text)` | 添加文字 Block |
| `remove_block(id)` | 删除 Block 及子 Block |
| `toggle_collapse(id)` | 切换折叠状态 |

每次增删后 `get_commands()` 自动重算布局。

---

## Canvas 系统 API

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_canvas_invalidate` | `(id: String)` | 重绘指定画布 |
| `sys_canvas_invalidate_all` | `()` | 重绘所有画布 |
| `sys_canvas_set_render_mode` | `(id: String, mode: String)` | 设置渲染模式 |
| `sys_canvas_flush` | `(id: String)` | 刷新画布 |
| `sys_canvas_render` | `(commands: String)` | 提交 DisplayList JSON 到 CanvasRenderer |

`sys_canvas_render` 在 `display_list_render()` 内部自动调用，将序列化后的 DrawItem 数组推送到 Swift 侧 `CanvasRenderer`，触发 Canvas 重绘。

详见 [系统 API - 画布](../logic/system-api.md#画布canvas)。
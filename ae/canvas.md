# Canvas / 画布

Canvas 组件通过 `onRender` 绑定 Rust 方法，返回 DisplayList JSON 驱动绘制。适用于自定义绘图、手写笔迹、图表渲染等场景。

---

## Canvas

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| onRender | callback | 是 | — | 绘制回调，绑定 Rust 方法名。如 `{Home.get_commands}` |
| onDraw | callback | 否 | — | 每帧绘制回调（连续绘制模式） |

继承 `_style`。不支持子组件。

### AE 示例

```ae
Canvas(onRender={Home.get_commands}).w(100%).h(400)
```

---

## onRender 工作原理

1. Canvas `onAppear` 时调用 `onRender` 绑定的 Rust 方法
2. Rust 方法构造 DisplayList，返回 JSON 字符串
3. Swift CanvasRenderer 解析 JSON，在 SwiftUI Canvas 上绘制 DrawItem
4. 绘制完成后 CanvasRenderer 缓存结果，避免重复渲染

### DisplayList 构造示例

```rust
pub fn get_commands(&mut self) -> String {
    use crate::canvas::{DisplayList, display_list_new, display_list_extend, display_list_render};

    let mut list = display_list_new();
    display_list_extend(&mut list, vec![
        DrawItem::Rect { x: 0.0, y: 0.0, w: 300.0, h: 200.0,
            fill: Some("#FFF8E7".to_string()), border: None, border_width: 0.0,
            radius: 12.0, rotation: 0.0 },
        DrawItem::Text { x: 20.0, y: 20.0, text: "Hello".to_string(),
            font: "AetherHand".to_string(), size: 18.0, color: "#3C3C3C".to_string(),
            rotation: 0.0 },
    ]);
    display_list_render(&list)
}
```

---

## DrawItem 类型

| 类型 | 字段 | 说明 |
|------|------|------|
| `Text` | x, y, text, font, size, color, rotation | 文字 |
| `Rect` | x, y, w, h, fill, border, border_width, radius, rotation | 矩形 |
| `Path` | points, color, width, fill | 自由路径（贝塞尔） |
| `Circle` | cx, cy, r, color, width, fill | 圆形 |
| `Line` | x1, y1, x2, y2, color, width | 线段 |

---

## 重绘与刷新

Rust 逻辑层可通过系统 API 触发 Canvas 重绘：

```rust
crate::sys_canvas_invalidate("canvas_id".to_string());  // 重绘指定画布
crate::sys_canvas_invalidate_all();                       // 重绘所有画布
```

当状态变化需要重绘时，在 Rust 方法中调用 `sys_canvas_invalidate`，框架会重新调用 `onRender` 绑定的方法获取最新 DisplayList。

---

## Block 语义层

Block 是 DrawItem 之上的语义层，将内容块（文字、AI 回复、代码、涂鸦）渲染为一组 DrawItem。

详见 [Canvas 绘制与 Block 布局](../logic/canvas-drawing.md)。

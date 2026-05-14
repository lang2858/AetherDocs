# GPU 滤镜（Filter）

Rust 逻辑层通过 `sys_filter_*` 系列 API 控制图像和视图的 GPU 滤镜效果。支持链式组合、实时预览和参数调节。

---

## 滤镜 API

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_filter_apply` | `(view_id: String, filter_type: String, params: String)` | 对指定视图应用滤镜 |
| `sys_filter_remove` | `(view_id: String)` | 移除视图上的所有滤镜 |
| `sys_filter_chain` | `(view_id: String, filters: String)` | 链式应用多个滤镜（JSON 数组） |
| `sys_filter_preview` | `(image_path: String, filter_type: String, params: String)` | 预览滤镜效果，返回处理后的图片路径 |

---

## 支持的滤镜类型

### 基础调整

| 滤镜 | 参数 | 说明 |
|------|------|------|
| `brightness` | `value: Float` (-1.0 ~ 1.0) | 亮度调节 |
| `contrast` | `value: Float` (-1.0 ~ 1.0) | 对比度调节 |
| `saturation` | `value: Float` (0.0 ~ 2.0) | 饱和度调节 |
| `hue` | `value: Float` (0.0 ~ 360.0) | 色相旋转（度） |
| `temperature` | `value: Float` (-1.0 ~ 1.0) | 色温调节（冷 → 暖） |
| `sharpness` | `value: Float` (0.0 ~ 1.0) | 锐度调节 |

### 颜色效果

| 滤镜 | 参数 | 说明 |
|------|------|------|
| `grayscale` | — | 灰度化 |
| `sepia` | `intensity: Float` (0.0 ~ 1.0) | 怀旧/棕褐色效果 |
| `invert` | — | 反色 |
| `posterize` | `levels: Int` | 色调分离（减少色阶） |
| `vignette` | `intensity: Float`, `radius: Float` | 暗角效果 |

### 模糊与锐化

| 滤镜 | 参数 | 说明 |
|------|------|------|
| `blur` | `radius: Float` | 高斯模糊 |
| `motion_blur` | `radius: Float`, `angle: Float` | 运动模糊 |
| `zoom_blur` | `radius: Float`, `center_x: Float`, `center_y: Float` | 缩放模糊 |

### 风格化

| 滤镜 | 参数 | 说明 |
|------|------|------|
| `emboss` | `intensity: Float` | 浮雕效果 |
| `edge` | — | 边缘检测 |
| `pixelate` | `scale: Float` | 像素化（马赛克） |
| `halftone` | `scale: Float`, `center_x: Float`, `center_y: Float` | 半色调效果 |

---

## 参数格式

`params` 参数为 JSON 字符串：

```rust
crate::sys_filter_apply(
    "image_view".to_string(),
    "brightness".to_string(),
    r#"{"value": 0.3}"#.to_string(),
);
```

多参数滤镜：

```rust
crate::sys_filter_apply(
    "image_view".to_string(),
    "vignette".to_string(),
    r#"{"intensity": 0.8, "radius": 0.5}"#.to_string(),
);
```

---

## 链式滤镜

使用 `sys_filter_chain` 一次应用多个滤镜，按数组顺序依次执行：

```rust
crate::sys_filter_chain(
    "photo_view".to_string(),
    r#"[
        {"type": "brightness", "params": {"value": 0.2}},
        {"type": "contrast", "params": {"value": 0.15}},
        {"type": "saturation", "params": {"value": 0.8}},
        {"type": "vignette", "params": {"intensity": 0.6, "radius": 0.7}}
    ]"#.to_string(),
);
```

---

## 滤镜预览

`sys_filter_preview` 对图片文件应用滤镜，返回处理后的临时文件路径：

```rust
let preview_path = crate::sys_filter_preview(
    "/photos/sunset.jpg".to_string(),
    "sepia".to_string(),
    r#"{"intensity": 0.5}"#.to_string(),
);
// preview_path → "/tmp/aether_filter_preview_xxx.png"
```

适用于图片编辑器的实时预览场景——用户拖动滑块时反复调用，展示效果而不修改原图。

---

## 性能说明

- GPU 滤镜基于 Core Image / Metal Performance Shaders 实现，实时性良好
- 链式滤镜内部合并为 CIImage pipeline，避免中间纹理回读
- `sys_filter_preview` 使用缩略图处理，确保实时预览流畅
- 静态滤镜（grayscale、invert 等）在 CIImage 层面零开销合并

# 系统 API 参考

Aether 提供了一组 `sys_*` 系列函数，供 Rust 逻辑层直接调用原生平台能力。所有函数均通过 UniFFI 桥接到 Swift 原生实现。

## 系统 UI

### sys_toast

```rust
sys_toast(message: String, toast_type: String, duration: f64, position: String)
```

显示 Toast 提示。

| 参数 | 类型 | 说明 |
|---|---|---|
| `message` | `String` | 提示内容 |
| `toast_type` | `String` | 类型：`info` / `success` / `error` / `warning` |
| `duration` | `f64` | 显示时长（秒） |
| `position` | `String` | 位置：`top` / `center` / `bottom` |

### sys_dialog_show

```rust
sys_dialog_show(title: String, message: String, variant: String, confirm_text: String, cancel_text: String)
```

显示对话框。

| 参数 | 类型 | 说明 |
|---|---|---|
| `title` | `String` | 标题 |
| `message` | `String` | 内容 |
| `variant` | `String` | 变体：`alert` / `confirm` / `prompt` |
| `confirm_text` | `String` | 确认按钮文字 |
| `cancel_text` | `String` | 取消按钮文字 |

### sys_dialog_hide

```rust
sys_dialog_hide()
```

隐藏当前对话框。

## 导航

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_navigate` | `(route: String)` | 导航到指定路由 |
| `sys_go_back` | `()` | 返回上一页 |
| `sys_present` | `(route: String)` | 模态展示页面 |
| `sys_dismiss` | `()` | 关闭模态页面 |
| `sys_switch_tab` | `(index: i32)` | 切换 Tab 页 |
| `sys_current_route` | `() -> String` | 获取当前路由 |
| `sys_navigate_with` | `(route: String, params: HashMap<String, String>)` | 携带参数导航 |
| `sys_route_params` | `() -> HashMap<String, String>` | 获取所有路由参数 |
| `sys_route_param` | `(key: String) -> Option<String>` | 获取指定路由参数 |

## 抽屉（Drawers）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_drawer_open` | `(id: String)` | 打开指定抽屉 |
| `sys_drawer_close` | `(id: String)` | 关闭指定抽屉 |
| `sys_drawer_toggle` | `(id: String)` | 切换抽屉开关 |
| `sys_drawer_is_open` | `(id: String) -> bool` | 查询抽屉是否打开 |

## 主题

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_set_theme` | `(theme: String)` | 设置主题（`"light"` / `"dark"`） |
| `sys_get_theme` | `() -> String` | 获取当前主题 |

## 国际化

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_set_language` | `(locale: String)` | 设置语言（如 `"zh-CN"`、`"en"`） |
| `sys_get_language` | `() -> String` | 获取当前语言 |

## 存储（Storage）

基于 UserDefaults 的键值存储。

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_storage_set` | `(key: String, value: String)` | 存储字符串 |
| `sys_storage_get` | `(key: String) -> String` | 读取字符串 |
| `sys_storage_set_int` | `(key: String, value: i64)` | 存储整数 |
| `sys_storage_get_int` | `(key: String) -> i64` | 读取整数 |
| `sys_storage_set_float` | `(key: String, value: f64)` | 存储浮点数 |
| `sys_storage_get_float` | `(key: String) -> f64` | 读取浮点数 |
| `sys_storage_set_bool` | `(key: String, value: bool)` | 存储布尔值 |
| `sys_storage_get_bool` | `(key: String) -> bool` | 读取布尔值 |
| `sys_storage_remove` | `(key: String)` | 删除指定键 |
| `sys_storage_exists` | `(key: String) -> bool` | 检查键是否存在 |
| `sys_storage_clear` | `()` | 清空所有存储 |
| `sys_storage_set_json` | `(key: String, value: String)` | 存储 JSON 字符串 |
| `sys_storage_get_json` | `(key: String) -> String` | 读取 JSON 字符串 |

## 触觉反馈（Haptic）

| 函数 | 说明 |
|---|---|
| `sys_haptic_light()` | 轻触反馈 |
| `sys_haptic_medium()` | 中等反馈 |
| `sys_haptic_heavy()` | 重触反馈 |
| `sys_haptic_selection()` | 选择反馈 |
| `sys_haptic_success()` | 成功反馈 |
| `sys_haptic_warning()` | 警告反馈 |
| `sys_haptic_error()` | 错误反馈 |

所有触觉函数无参数、无返回值。

## 网络（Network）

### HTTP

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_http_get` | `(url: String, headers: HashMap<String, String>) -> String` | GET 请求 |
| `sys_http_post` | `(url: String, body: String, headers: HashMap<String, String>) -> String` | POST 请求 |

### WebSocket

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_ws_connect` | `(url: String)` | 建立 WebSocket 连接 |
| `sys_ws_send` | `(message: String)` | 发送消息 |
| `sys_ws_close` | `()` | 关闭连接 |
| `sys_ws_is_connected` | `() -> bool` | 查询连接状态 |

## 键盘（Keyboard）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_keyboard_focus` | `(field_id: String)` | 聚焦到指定输入框 |
| `sys_keyboard_dismiss` | `()` | 收起键盘 |
| `sys_keyboard_show_toolbar` | `(field_id: String)` | 显示输入工具栏 |
| `sys_keyboard_scroll_to_field` | `(field_id: String)` | 滚动到指定输入框 |

## 剪贴板（Clipboard）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_clipboard_set` | `(text: String)` | 复制文本到剪贴板 |
| `sys_clipboard_get` | `() -> String` | 从剪贴板粘贴文本 |
| `sys_clipboard_has_text` | `() -> bool` | 剪贴板是否有文本 |

## 定位（Location）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_location_get_current` | `() -> String` | 获取当前位置（JSON） |
| `sys_location_request_permission` | `()` | 请求定位权限 |
| `sys_location_has_permission` | `() -> bool` | 是否有定位权限 |

## 媒体采集（Media Capture）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_camera_open` | `()` | 打开相机 |
| `sys_camera_switch` | `()` | 切换前后摄像头 |
| `sys_video_record_start` | `()` | 开始录像 |
| `sys_video_record_stop` | `() -> String` | 停止录像，返回文件路径 |
| `sys_audio_record_start` | `()` | 开始录音 |
| `sys_audio_record_stop` | `() -> String` | 停止录音，返回文件路径 |
| `sys_audio_is_recording` | `() -> bool` | 是否正在录音 |

## 音频播放（Audio Playback）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_audio_play` | `(path: String)` | 播放音频文件 |
| `sys_audio_pause` | `()` | 暂停播放 |
| `sys_audio_stop` | `()` | 停止播放 |
| `sys_audio_seek` | `(position: f64)` | 跳转到指定位置（秒） |
| `sys_audio_get_duration` | `() -> f64` | 获取总时长 |
| `sys_audio_get_position` | `() -> f64` | 获取当前播放位置 |
| `sys_audio_set_volume` | `(volume: f64)` | 设置音量（0.0 ~ 1.0） |

## 分享（Share）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_share_text` | `(text: String)` | 分享文本 |
| `sys_share_image` | `(path: String)` | 分享图片 |
| `sys_share_url` | `(url: String)` | 分享链接 |

## 生物识别（Biometrics）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_biometric_available` | `() -> bool` | 设备是否支持生物识别 |
| `sys_biometric_auth` | `(reason: String) -> bool` | 发起生物识别认证 |
| `sys_biometric_has_enrolled` | `() -> bool` | 是否已录入生物特征 |

## 二维码（QR）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_qr_scan_start` | `()` | 开始扫描二维码 |
| `sys_qr_scan_stop` | `()` | 停止扫描 |
| `sys_qr_generate` | `(content: String) -> String` | 生成二维码，返回图片路径 |

## 支付（Payment）

> 当前为 Stub 实现，仅提供接口定义。

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_pay_request` | `(params: String) -> String` | 发起支付请求 |
| `sys_pay_check_result` | `(order_id: String) -> String` | 查询支付结果 |
| `sys_pay_supported_providers` | `() -> String` | 获取支持的支付渠道 |

## 文件选择（File Picker）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_picker_image` | `() -> String` | 选择图片，返回路径 |
| `sys_picker_file` | `(extensions: String) -> String` | 选择文件（按扩展名过滤） |

## 通知（Notification）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_notification_schedule` | `(title: String, body: String, delay: f64) -> String` | 调度本地通知，返回 ID |
| `sys_notification_cancel` | `(id: String)` | 取消通知 |
| `sys_notification_request_permission` | `() -> bool` | 请求通知权限 |
| `sys_notification_has_permission` | `() -> bool` | 是否有通知权限 |

## 图片处理（Image Processing）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_image_save_to_photos` | `(path: String)` | 保存图片到相册 |
| `sys_image_save_to_file` | `(path: String, dest: String)` | 保存图片到文件 |
| `sys_image_compress` | `(path: String, quality: f64) -> String` | 压缩图片，返回路径 |
| `sys_image_resize` | `(path: String, width: i32, height: i32) -> String` | 调整图片尺寸 |
| `sys_image_get_info` | `(path: String) -> String` | 获取图片信息（JSON） |

## 视频（Video）

### 播放控制

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_video_load` | `(path: String)` | 加载视频 |
| `sys_video_play` | `()` | 播放 |
| `sys_video_pause` | `()` | 暂停 |
| `sys_video_stop` | `()` | 停止 |
| `sys_video_seek` | `(position: f64)` | 跳转（秒） |
| `sys_video_set_speed` | `(speed: f64)` | 设置播放速度 |
| `sys_video_set_volume` | `(volume: f64)` | 设置音量 |
| `sys_video_set_muted` | `(muted: bool)` | 静音切换 |

### 编辑导出

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_video_export` | `(config: String) -> String` | 导出视频，返回路径 |
| `sys_video_trim` | `(start: f64, end: f64) -> String` | 裁剪视频，返回路径 |
| `sys_video_get_info` | `(path: String) -> String` | 获取视频信息（JSON） |

### 状态查询

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_video_get_duration` | `() -> f64` | 获取总时长 |
| `sys_video_current_time` | `() -> f64` | 获取当前播放时间 |
| `sys_video_current_frame` | `() -> String` | 获取当前帧（图片路径） |
| `sys_video_is_playing` | `() -> bool` | 是否正在播放 |

## GPU 滤镜（GPU Filters）

### 图片滤镜

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_image_apply_filter` | `(path: String, filter: String, intensity: f64) -> String` | 对图片应用滤镜 |
| `sys_image_filters` | `(path: String, filters: String) -> String` | 应用多个滤镜 |
| `sys_image_color_matrix` | `(path: String, matrix: String) -> String` | 应用色彩矩阵 |

### 视频滤镜

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_video_set_filter` | `(filter: String, intensity: f64)` | 设置视频滤镜 |
| `sys_video_filters` | `(filters: String)` | 设置多个视频滤镜 |
| `sys_video_remove_filter` | `(filter: String)` | 移除指定滤镜 |
| `sys_video_clear_filters` | `()` | 清除所有滤镜 |

### 自定义滤镜

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_filter_register_custom` | `(name: String, kernel: String)` | 注册自定义滤镜 |
| `sys_filter_apply_custom` | `(name: String, params: String)` | 应用自定义滤镜 |
| `sys_filter_get_builtin_list` | `() -> String` | 获取内置滤镜列表 |

### 内置滤镜（15 种）

`brightness`、`contrast`、`saturation`、`blur`、`sharpen`、`warmth`、`tint`、`vignette`、`grayscale`、`sepia`、`invert`、`hue`、`exposure`、`highlights`、`shadows`

## 画布（Canvas）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_canvas_invalidate` | `(id: String)` | 重绘指定画布 |
| `sys_canvas_invalidate_all` | `()` | 重绘所有画布 |
| `sys_canvas_set_render_mode` | `(id: String, mode: String)` | 设置渲染模式 |
| `sys_canvas_flush` | `(id: String)` | 刷新画布 |
| `sys_canvas_render` | `(commands: String)` | 提交 DisplayList JSON 到 CanvasRenderer |

`sys_canvas_render` 在 `display_list_render()` 内部自动调用，将序列化后的 DrawItem 数组推送到 Swift 侧 `CanvasRenderer`，触发 Canvas 重绘。

## 地图（Map）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_map_set_center` | `(lat: f64, lng: f64)` | 设置地图中心 |
| `sys_map_set_zoom` | `(level: f64)` | 设置缩放级别 |
| `sys_map_add_annotation` | `(lat: f64, lng: f64, title: String)` | 添加标注 |
| `sys_map_remove_annotation` | `(id: String)` | 移除标注 |
| `sys_map_clear_annotations` | `()` | 清除所有标注 |
| `sys_map_show_route` | `(points: String)` | 显示路线 |
| `sys_map_get_current_region` | `() -> String` | 获取当前区域（JSON） |

## 图表（Chart）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_chart_broadcast_filter` | `(chart_id: String, filter: String)` | 广播过滤器到图表 |
| `sys_chart_set_highlight` | `(chart_id: String, index: i32)` | 设置高亮数据点 |
| `sys_chart_clear_highlight` | `(chart_id: String)` | 清除高亮 |
| `sys_chart_downsample` | `(chart_id: String, threshold: i32)` | 降采样优化 |

## 3D 场景（3D）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_scene_load_model` | `(path: String)` | 加载 3D 模型 |
| `sys_scene_set_camera` | `(x: f64, y: f64, z: f64)` | 设置相机位置 |
| `sys_scene_rotate` | `(x: f64, y: f64, z: f64)` | 旋转场景 |
| `sys_scene_zoom` | `(level: f64)` | 缩放场景 |
| `sys_scene_set_light` | `(config: String)` | 设置灯光 |
| `sys_scene_capture` | `() -> String` | 截图，返回图片路径 |

## 文档（Document）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_doc_parse_pdf` | `(path: String) -> String` | 解析 PDF |
| `sys_doc_parse_epub` | `(path: String) -> String` | 解析 EPUB |
| `sys_doc_parse_docx` | `(path: String) -> String` | 解析 DOCX |
| `sys_doc_get_page` | `(doc_id: String, page: i32) -> String` | 获取指定页内容 |
| `sys_doc_get_toc` | `(doc_id: String) -> String` | 获取目录 |
| `sys_doc_get_metadata` | `(doc_id: String) -> String` | 获取元数据 |
| `sys_doc_search` | `(doc_id: String, query: String) -> String` | 搜索文档内容 |

## 屏幕（Screen）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_screen_set_brightness` | `(level: f64)` | 设置屏幕亮度（0.0 ~ 1.0） |
| `sys_screen_get_brightness` | `() -> f64` | 获取屏幕亮度 |
| `sys_screen_set_night_mode` | `(enabled: bool)` | 开关夜间模式 |
| `sys_screen_keep_awake` | `(enabled: bool)` | 保持屏幕常亮 |
| `sys_screen_set_orientation` | `(orientation: String)` | 设置屏幕方向 |

## 撤销/重做（Undo/Redo）

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_undo_push` | `(state: String)` | 压入撤销栈 |
| `sys_undo_pop` | `() -> String` | 弹出撤销栈 |
| `sys_undo_clear` | `()` | 清空撤销栈 |
| `sys_undo_can_undo` | `() -> bool` | 是否可撤销 |
| `sys_undo_can_redo` | `() -> bool` | 是否可重做 |
| `sys_undo_get_count` | `() -> i32` | 获取撤销栈深度 |
| `sys_redo_pop` | `() -> String` | 弹出重做栈 |

## 设备方向与屏幕尺寸

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_on_orientation_change` | `(callback: String)` | 注册方向变化回调 |
| `sys_on_screen_size_change` | `(callback: String)` | 注册屏幕尺寸变化回调 |

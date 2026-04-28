# Media / 媒体组件

媒体组件用于嵌入外部内容、播放音视频和展示地图。包含 WebView、Video、Audio、VideoPlayer、AudioPlayer、Camera、QRScanner、Map、MapView 和 Link。

---

## WebView

网页视图组件，用于嵌入网页内容。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| src | str | 是 | — | 网页 URL |

| 事件 | 签名 | 说明 |
|------|------|------|
| onLoad | `() => void` | 页面加载完成 |
| onError | `(message: str) => void` | 加载失败 |

继承 `_style`。

### AE 示例

```ae
WebView(src="https://docs.aether.dev" w=100% h=500)
```

### SwiftUI 输出

```swift
WebView(url: URL(string: "https://docs.aether.dev")!)
    .frame(maxWidth: .infinity)
    .frame(height: 500)
    .onLoad { /* ... */ }
    .onError { message in /* ... */ }
```

> 注意：macOS 使用 `WKWebView`，iOS 使用 `WKWebView`，需导入 `WebKit` 框架。Aether codegen 自动生成 `UIViewRepresentable` / `NSViewRepresentable` 包装。

---

## Video

视频播放组件，支持播放控制和程序化操作。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| src | str | 是 | — | 视频资源 URL 或本地路径 |
| poster | str | 否 | — | 封面图 URL |
| autoPlay | bool | 否 | false | 是否自动播放 |
| controls | bool | 否 | true | 是否显示控制栏 |
| loop | bool | 否 | false | 是否循环播放 |
| muted | bool | 否 | false | 是否静音 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onLoad | `() => void` | 视频加载就绪 |

继承 `_style`。

### 系统控制 API

除了声明式属性，Video 还支持从 Rust 逻辑中通过系统 API 进行程序化控制：

```rust
sys_video_play()                // 播放
sys_video_pause()               // 暂停
sys_video_seek(time: f64)       // 跳转到指定时间（秒）
sys_video_set_muted(muted: bool) // 设置静音
sys_video_set_volume(vol: f64)  // 设置音量 (0.0 ~ 1.0)
sys_video_get_duration() -> f64 // 获取总时长
sys_video_get_current_time() -> f64 // 获取当前播放时间
```

### AE 示例

```ae
Video(src=$assets.intro_video poster=$assets.video_poster controls=true)
    .w(100%)
    .h(220)
    .radius(12)
```

### SwiftUI 输出

```swift
VideoPlayer(player: AVPlayer(url: URL(string: AppAssets.intro_video)!))
    .frame(maxWidth: .infinity)
    .frame(height: 220)
    .cornerRadius(12)
    .overlay(alignment: .topLeading) {
        if let poster = AppAssets.video_poster {
            Image(poster)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(height: 220)
                .clipped()
        }
    }
```

---

## Audio

音频播放组件，支持播放控制和程序化操作。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| src | str | 是 | — | 音频资源 URL 或本地路径 |
| autoPlay | bool | 否 | false | 是否自动播放 |
| controls | bool | 否 | true | 是否显示控制栏 |
| loop | bool | 否 | false | 是否循环播放 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onLoad | `() => void` | 音频加载就绪 |

继承 `_style`。

### 系统控制 API

```rust
sys_audio_play()                 // 播放
sys_audio_pause()                // 暂停
sys_audio_seek(time: f64)        // 跳转到指定时间（秒）
sys_audio_set_volume(vol: f64)   // 设置音量 (0.0 ~ 1.0)
sys_audio_get_duration() -> f64  // 获取总时长
sys_audio_get_current_time() -> f64 // 获取当前播放时间
```

### AE 示例

```ae
Audio(src=$assets.bg_music controls=true loop=true)
    .w(100%)
    .h(44)
```

### SwiftUI 输出

```swift
HStack(spacing: 12) {
    Button(action: { audioPlayer.togglePlayPause() }) {
        Image(systemName: audioPlayer.isPlaying ? "pause.fill" : "play.fill")
    }
    Slider(value: $audioPlayer.currentTime, in: 0...audioPlayer.duration)
    Text(formatTime(audioPlayer.currentTime))
        .font(.system(size: 12))
        .foregroundColor(AppColors.text_secondary)
}
.padding(.horizontal, 12)
.frame(maxWidth: .infinity)
.frame(height: 44)
```

---

## VideoPlayer

视频播放器组件，与 Video 功能类似但为独立组件形式。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| src | str | 是 | — | 视频资源路径，使用 `$assets.xxx` 引用 |
| poster | str | 否 | — | 封面图，使用 `$assets.xxx` 引用 |
| autoPlay | bool | 否 | false | 是否自动播放 |
| controls | bool | 否 | false | 是否显示控制栏 |
| loop | bool | 否 | false | 是否循环播放 |
| muted | bool | 否 | false | 是否静音 |

继承 `_style`。

### AE 示例

```ae
VideoPlayer(src=$assets.intro_video poster=$assets.video_poster controls=true)
    .w(100%)
    .h(220)
    .radius(12)
```

---

## AudioPlayer

音频播放器组件，与 Audio 功能类似但为独立组件形式。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| src | str | 是 | — | 音频资源路径，使用 `$assets.xxx` 引用 |
| autoPlay | bool | 否 | false | 是否自动播放 |
| controls | bool | 否 | false | 是否显示控制栏 |
| loop | bool | 否 | false | 是否循环播放 |

继承 `_style`。

### AE 示例

```ae
AudioPlayer(src=$assets.bg_music controls=true loop=true)
    .w(100%)
    .h(44)
```

---

## Camera

相机组件，调用设备摄像头进行拍照。

| 事件 | 签名 | 说明 |
|------|------|------|
| onCapture | `() => void` | 拍照完成回调 |

继承 `_style`。

### AE 示例

```ae
Camera(onCapture={Profile.on_capture()})
    .w(320)
    .h(240)
    .radius(8)
```

---

## QRScanner

二维码扫描组件，调用设备摄像头进行扫码。

| 事件 | 签名 | 说明 |
|------|------|------|
| onScan | `() => void` | 扫码成功回调 |

继承 `_style`。

### AE 示例

```ae
QRScanner(onScan={Auth.on_qr_scan()})
    .w(200)
    .h(200)
    .radius(8)
```

---

## Map

地图组件，展示地图视图和标记点。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| latitude | num | 否 | — | 中心纬度 |
| longitude | num | 否 | — | 中心经度 |
| zoom | num | 否 | 15 | 缩放级别 |
| markers | str | 否 | — | 标记点数据 |
| showLocation | bool | 否 | false | 是否显示当前位置 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onItemClick | `(id: str) => void` | 标记点点击 |
| onLocationChange | `(lat: num, lng: num) => void` | 位置变化 |

继承 `_style`。

### 系统控制 API

```rust
sys_map_set_center(lat: f64, lng: f64)   // 设置中心点
sys_map_set_zoom(zoom: f64)              // 设置缩放级别
sys_map_add_marker(id: String, lat: f64, lng: f64, title: String) // 添加标记
sys_map_remove_marker(id: String)        // 移除标记
sys_map_get_center() -> (f64, f64)       // 获取当前中心点
sys_map_get_zoom() -> f64                // 获取当前缩放级别
```

### AE 示例

```ae
Map(latitude=39.9042 longitude=116.4074 zoom=12 markers={viewModel.markers} showLocation=true)
    .w(100%)
    .h(300)
    .radius(12)
```

### SwiftUI 输出

```swift
// 使用 MapKit
Map(coordinateRegion: $mapRegion,
    annotationItems: viewModel.markers
) { marker in
    MapMarker(coordinate: CLLocationCoordinate2D(latitude: marker.lat, longitude: marker.lng),
              title: marker.title)
}
.frame(maxWidth: .infinity)
.frame(height: 300)
.cornerRadius(12)
.onAppear { locationManager.requestWhenInUseAuthorization() }
```

---

## Link

链接组件，用于跳转外部 URL。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| href | str | 是 | — | 目标 URL |
| text | str | 否 | — | 链接文字 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onTap | `() => void` | 点击回调 |

### AE 示例

```ae
Link(href="https://aether.dev" text="访问官网")
```

### SwiftUI 输出

```swift
Link("访问官网", destination: URL(string: "https://aether.dev")!)
```

> 注意：Link 在 macOS 上使用 `NSWorkspace.shared.open(url)`，iOS 上使用 `UIApplication.shared.open(url)` 处理外部链接跳转。

---

## MapView

地图视图组件，与 Map 功能类似但支持地图类型选择。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| latitude | num | 否 | — | 中心纬度 |
| longitude | num | 否 | — | 中心经度 |
| zoom | num | 否 | — | 缩放级别 |
| showUserLocation | bool | 否 | false | 是否显示用户当前位置 |
| mapType | enum | 否 | standard | 地图类型：`standard` / `satellite` / `hybrid` |

继承 `_style`。

### AE 示例

```ae
MapView(latitude=39.9042 longitude=116.4074 zoom=12 showUserLocation=true mapType="standard")
    .w(100%)
    .h(300)
    .radius(12)
```

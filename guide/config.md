# 配置参考

Aether 项目通过 `aether.toml` 配置文件进行所有设置。该文件位于项目根目录。

## 完整配置示例

```toml
[app]
name = "myapp"
display_name = "My App"
version = "0.1.0"
identifier = "com.example.myapp"

[window]
width = 800
height = 600
resizable = true
titlebar_style = "default"

[platform.macos]
enabled = true
min_version = "12.0"

[platform.iphone]
enabled = true
min_version = "16.0"

[platform.ipad]
enabled = false
min_version = "16.0"

[platform.android]
enabled = false
min_version = "10"

[platform.android-pad]
enabled = false
min_version = "10"

[platform.windows]
enabled = false
min_version = "10"

[platform.linux]
enabled = false

[platform.harmony]
enabled = false
min_version = "3.0"

[platform.harmony-pad]
enabled = false
min_version = "3.0"

[platform.web]
enabled = false

[permissions]
camera = false
location = false
network = true

[theme]
default = "light"
available = ["light", "dark"]

[i18n]
default = "zh-CN"
fallback = "en"

[navigation]
style = "auto"
initial_route = "home"
```

## 配置段详解

### [app]

应用的基本信息。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | string | `""` | 应用内部名称，用于生成代码标识符，自动将 `-` 转换为 `_` |
| `display_name` | string | `"Aether App"` | 应用显示名称，用于 Xcode 项目和启动界面 |
| `version` | string | `"0.1.0"` | 应用版本号 |
| `identifier` | string | `"com.example.app"` | 应用 Bundle Identifier |

### [window]

应用窗口配置，主要用于桌面平台。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | u32 | `800` | 窗口默认宽度（像素） |
| `height` | u32 | `600` | 窗口默认高度（像素） |
| `resizable` | bool | `true` | 窗口是否可调整大小 |
| `titlebar_style` | string | `"default"` | 标题栏样式，仅 macOS 生效。详见下方说明 |

#### window.titlebar_style 可选值

| 值 | 说明 |
|----|------|
| `default` | 标准标题栏，显示窗口标题和红绿灯按钮 |
| `hidden` | 隐藏标题栏，保留红绿灯按钮，内容延伸到标题栏区域。通常配合 `Toolbar` 组件使用，编译器会自动添加顶部留白以避免内容与红绿灯按钮重叠 |
| `inline` | macOS 13+ 内联标题栏，标题融入工具栏区域，适合工具类应用 |

### [platform.\*]

各平台的构建配置。桌面平台和移动平台字段相同，Web 平台仅支持 `enabled` 字段。

#### 桌面平台（macOS / Windows / Linux）

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | bool | 各平台不同 | 是否启用该平台构建 |
| `min_version` | string | 各平台不同 | 最低系统版本要求 |

#### 移动平台（iPhone / iPad / Android / Android Pad / Harmony / Harmony Pad）

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | bool | 各平台不同 | 是否启用该平台构建 |
| `min_version` | string | 各平台不同 | 最低系统版本要求 |

#### Web 平台

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | bool | `false` | 是否启用 Web 平台构建 |

#### 各平台默认值

| 平台 | enabled 默认值 | min_version 默认值 |
|------|---------------|-------------------|
| `macos` | `true` | `"12.0"` |
| `iphone` | `true` | `"16.0"` |
| `ipad` | `false` | `"16.0"` |
| `android` | `false` | `"10"` |
| `android-pad` | `false` | `"10"` |
| `windows` | `false` | `"10"` |
| `linux` | `false` | `""` |
| `harmony` | `false` | `"3.0"` |
| `harmony-pad` | `false` | `"3.0"` |
| `web` | `false` | — |

### [permissions]

声明应用需要的系统权限，用于生成平台对应的权限描述（如 iOS 的 Info.plist 条目）。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `camera` | bool | `false` | 相机访问权限 |
| `location` | bool | `false` | 位置信息权限 |
| `network` | bool | `true` | 网络访问权限 |

### [theme]

主题配置。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `default` | string | `"light"` | 默认主题名称，对应 `src/themes/` 下的 `.toml` 文件名 |
| `available` | string[] | `["light", "dark"]` | 可用主题列表，每个名称对应 `src/themes/` 下的一个 `.toml` 文件 |

### [i18n]

国际化配置。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `default` | string | `"zh-CN"` | 默认语言，对应 `src/i18n/` 下的 `.toml` 文件名 |
| `fallback` | string | `"en"` | 回退语言，当默认语言缺少某个翻译 key 时使用 |

### [navigation]

导航配置。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `style` | string | `"auto"` | 导航风格，可选值：`auto`、`tabs`、`stack`、`split` |
| `initial_route` | string | `"home"` | 初始路由，对应 `src/ui/` 下的 `.ae` 文件名 |

#### navigation.style 可选值

| 值 | 说明 |
|----|------|
| `auto` | 根据平台自动选择导航风格 |
| `tabs` | 底部 Tab 导航 |
| `stack` | 堆栈式导航（push/pop） |
| `split` | 分栏导航（主从布局） |

## 全部默认值速查表

| 配置段 | 字段 | 默认值 |
|--------|------|--------|
| `[app]` | `name` | `""` |
| `[app]` | `display_name` | `"Aether App"` |
| `[app]` | `version` | `"0.1.0"` |
| `[app]` | `identifier` | `"com.example.app"` |
| `[window]` | `width` | `800` |
| `[window]` | `height` | `600` |
| `[window]` | `resizable` | `true` |
| `[window]` | `titlebar_style` | `"default"` |
| `[platform.macos]` | `enabled` | `true` |
| `[platform.macos]` | `min_version` | `"12.0"` |
| `[platform.iphone]` | `enabled` | `true` |
| `[platform.iphone]` | `min_version` | `"16.0"` |
| `[platform.ipad]` | `enabled` | `false` |
| `[platform.ipad]` | `min_version` | `"16.0"` |
| `[platform.android]` | `enabled` | `false` |
| `[platform.android]` | `min_version` | `"10"` |
| `[platform.android-pad]` | `enabled` | `false` |
| `[platform.android-pad]` | `min_version` | `"10"` |
| `[platform.windows]` | `enabled` | `false` |
| `[platform.windows]` | `min_version` | `"10"` |
| `[platform.linux]` | `enabled` | `false` |
| `[platform.linux]` | `min_version` | `""` |
| `[platform.harmony]` | `enabled` | `false` |
| `[platform.harmony]` | `min_version` | `"3.0"` |
| `[platform.harmony-pad]` | `enabled` | `false` |
| `[platform.harmony-pad]` | `min_version` | `"3.0"` |
| `[platform.web]` | `enabled` | `false` |
| `[permissions]` | `camera` | `false` |
| `[permissions]` | `location` | `false` |
| `[permissions]` | `network` | `true` |
| `[theme]` | `default` | `"light"` |
| `[theme]` | `available` | `["light", "dark"]` |
| `[i18n]` | `default` | `"zh-CN"` |
| `[i18n]` | `fallback` | `"en"` |
| `[navigation]` | `style` | `"auto"` |
| `[navigation]` | `initial_route` | `"home"` |

# 主题系统

Aether 的主题系统通过 `theme.toml` 集中定义设计令牌（Design Tokens），在 AE 模板中以 `$colors.xxx`、`$typography.xxx` 等方式引用，生成 Swift 代码时自动映射为 `AppColors`、`AppTypography` 等类型，并支持运行时 light/dark 切换。

## 设计令牌引用

在 AE 模板中，使用 `$` 前缀引用 theme.toml 中定义的令牌：

| 引用语法 | 映射目标 | 说明 |
|---|---|---|
| `$colors.xxx` | `AppColors.xxx` | 颜色令牌 |
| `$typography.xxx` | `AppTypography.xxx` | 排版令牌 |
| `$spacing.xxx` | `AppSpacing.xxx` | 间距令牌 |
| `$radius.xxx` | `AppRadius.xxx` | 圆角令牌 |

### 常用颜色令牌

| 令牌名 | 用途 |
|---|---|
| `primary` | 主强调色 |
| `secondary` | 辅助强调色 |
| `background` | 页面背景色 |
| `text` | 正文文字色 |
| `text_secondary` | 次要文字色 |
| `text_hint` | 提示文字色 |
| `text_on_primary` | 主色上的文字色 |
| `header_bg` | 头部背景色 |
| `card_bg` | 卡片背景色 |
| `info_bg` | 信息区背景色 |
| `divider` | 分割线色 |
| `error` | 错误色 |
| `accent_blue` | 蓝色强调色 |

## theme.toml 结构

```toml
[colors]
primary = "#007AFF"
secondary = "#5856D6"
background = "#FFFFFF"
text = "#000000"
text_secondary = "#666666"
text_hint = "#999999"
text_on_primary = "#FFFFFF"
header_bg = "#F8F8F8"
card_bg = "#FFFFFF"
info_bg = "#F0F0F0"
divider = "#E0E0E0"
error = "#FF3B30"
accent_blue = "#007AFF"

[typography]
headline = { size = 24, weight = "bold" }
body = { size = 16, weight = "regular" }
caption = { size = 12, weight = "regular" }

[spacing]
small = 4
medium = 8
large = 16

[radius]
small = 4
medium = 8
large = 16

[styles.Text]
color = "$colors.text"
font = "$typography.body"

[styles.Button]
color = "$colors.primary"
font = "$typography.body"
padding = "$spacing.medium"
cornerRadius = "$radius.small"

[styles.Divider]
color = "$colors.divider"
```

### 各节说明

| 节名 | 内容 | 值类型 |
|---|---|---|
| `[colors]` | 颜色令牌 | 十六进制色值字符串 |
| `[typography]` | 排版令牌 | `{ size = 数字, weight = "字重" }` |
| `[spacing]` | 间距令牌 | 整数（pt） |
| `[radius]` | 圆角令牌 | 整数（pt） |
| `[styles.Xxx]` | 组件默认样式 | 引用其他令牌或直接值 |

## 排版字重

`weight` 字段支持以下值：

| weight 值 | 说明 |
|---|---|
| `regular` | 常规 |
| `bold` | 粗体 |
| `semibold` | 半粗 |
| `medium` | 中等 |
| `light` | 细体 |
| `thin` | 极细 |

## AE 模板中的使用

### 颜色引用

```ae
VStack {
    Text("标题")
        .color($colors.text)
        .bg($colors.primary)
}
```

### 排版引用

```ae
Text("大标题" font=$typography.headline)
Text("正文" font=$typography.body)
Text("注释" font=$typography.caption)
```

### 样式组合引用

组件默认样式通过 `[styles.Xxx]` 节定义，引用方式：

```ae
Text("自动应用样式")   // 自动应用 [styles.Text] 中定义的 color 和 font
```

## 生成 Swift 代码

构建系统根据 theme.toml 生成以下 Swift 类型：

```swift
// 颜色 — 自动支持 light/dark 切换
struct AppColors {
    static var primary: Color    // 根据 traitCollection 返回对应色值
    static var text: Color
    static var background: Color
    // ...
}

// 排版
struct AppTypography {
    static var headline: Font    // .system(size: 24, weight: .bold)
    static var body: Font        // .system(size: 16, weight: .regular)
    static var caption: Font     // .system(size: 12, weight: .regular)
}

// 间距
struct AppSpacing {
    static var small: CGFloat    // 4
    static var medium: CGFloat   // 8
    static var large: CGFloat    // 16
}

// 圆角
struct AppRadius {
    static var small: CGFloat    // 4
    static var medium: CGFloat   // 8
    static var large: CGFloat    // 16
}
```

### Light / Dark 切换

`AppColors` 内部根据 iOS 的 `UITraitCollection` 自动适配：

- 当系统切换到 Dark Mode 时，`AppColors` 会使用 dark 主题色值。
- 也可以从 Rust 逻辑中主动切换主题。

## 主题切换

从 Rust 逻辑中调用系统 API 切换主题：

```rust
pub fn toggle_theme(&mut self) {
    let current = sys_get_theme();
    if current == "light" {
        sys_set_theme("dark".to_string());
    } else {
        sys_set_theme("light".to_string());
    }
}
```

`sys_set_theme` 会立即更新 `AppColors` 的所有颜色值，所有引用 `$colors.xxx` 的 UI 组件自动刷新。

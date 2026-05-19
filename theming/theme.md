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
| `$assets.xxx` | `AppAssets.xxx` | 资源令牌（图片、图标等） |

### 常用颜色令牌

| 令牌名 | 用途 |
|---|---|
| `primary` | 主强调色 |
| `secondary` | 辅助强调色 |
| `background` | 页面背景色 |
| `surface` | 二级背景色（输入框、卡片等） |
| `sidebar_bg` | 侧边栏背景色 |
| `toolbar_bg` | 工具栏/标题栏背景色 |
| `card_bg` | 卡片背景色 |
| `text` | 正文文字色 |
| `text_secondary` | 次要文字色 |
| `text_hint` | 提示/占位文字色 |
| `text_on_primary` | 主色上的文字色 |
| `divider` | 分割线/边框色 |
| `error` | 错误色 |
| `success` | 成功色 |
| `accent_blue` | 蓝色强调色 |
| `hover_bg` | **必需** — 按钮/图标按钮 hover 背景色 |

### `hover_bg` 令牌

`hover_bg` 是**必需的颜色令牌**，Button 和 IconButton 的 hover 效果依赖 `AppColors.hover_bg`。

- 必须在 `[colors]` 节中定义，**不是** `[styles.Button]` 的属性
- 如果缺少 `hover_bg`，按钮 hover 效果会**静默失效**（不会报错，但 hover 时无背景色变化）
- 建议值：light 主题使用略深的背景色（如 `"#F1F5F9"`），dark 主题使用略浅的背景色（如 `"#262C36"`）

```toml
[colors]
# ... 其他颜色
hover_bg = "#F1F5F9"   # light 主题
hover_bg = "#262C36"   # dark 主题
```

## theme.toml 结构

```toml
[colors]
primary = "#0A84FF"
secondary = "#5E5CE6"
background = "#0D1117"
surface = "#1E293B"
toolbar_bg = "#161B22"
sidebar_bg = "#0D1117"
card_bg = "#1E293B"
hover_bg = "#262C36"       # 必需 — Button/IconButton hover 效果依赖此令牌
text = "#C9D1D9"
text_secondary = "#8B949E"
text_hint = "#6E7681"
text_on_primary = "#FFFFFF"
divider = "#30363D"
error = "#FF453A"
success = "#3FB950"
accent_blue = "#2563EB"

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

[styles.VStack]
spacing = "$spacing.medium"
padding = "$spacing.large"
border = "1,$colors.divider"
```

### 各节说明

| 节名 | 内容 | 值类型 |
|---|---|---|
| `[colors]` | 颜色令牌 | 十六进制色值字符串 |
| `[typography]` | 排版令牌 | `{ size = 数字, weight = "字重" }` |
| `[spacing]` | 间距令牌 | 整数（pt） |
| `[radius]` | 圆角令牌 | 整数（pt） |
| `[styles.Xxx]` | 组件默认样式 | 引用其他令牌或直接值 |

## 全局样式自动应用

`[styles.Xxx]` 中定义的属性会自动应用到所有该类型的组件，无需在每个 AE 组件上手动重复书写。

### 机制

| 组件类别 | 应用时机 | 说明 |
|---|---|---|
| 即时组件（Text/Button/Icon/Image 等） | 生成时立即附加 | 在组件 dispatch 后统一追加到输出 |
| 容器组件（VStack/HStack/ZStack/ScrollView） | `}` 闭合时附加 | 修饰符在闭括号后追加 |

### 覆盖规则

样式按四级优先级合并，高优先级覆盖低优先级：

| 优先级 | 来源 | 说明 |
|--------|------|------|
| 0 | System | 系统默认值 |
| 1 | Framework | 框架预设 |
| 2 | Theme | `[styles.Xxx]` 全局样式 |
| 3 | AeExplicit | AE 代码中手动书写的修饰符 |

- AE 中手动书写的修饰符（AeExplicit）优先级最高，覆盖全局样式
- 如果 AE 中写了 `.border(1, "#xxx")`，全局样式的 `border` 不会重复追加
- 如果 AE 中写了 `.color($colors.text)`，全局样式的 `color` 不会重复追加

#### `auto` 回退机制

当全局样式设置了某个属性（如 `w = "infinity"`），但某个组件需要按内容自适应时，使用 `auto` 值覆盖：

```ae
// 全局: VStack 默认 w=infinity → 撑满宽度
VStack { ... }

// 覆盖: .w(auto) → 不生成 .frame(maxWidth: .infinity)，按内容适配
VStack { ... }.w(auto)
```

`auto` 可用于 `w`、`h`、`font`、`border` 等属性，效果是抑制对应 SwiftUI modifier 的生成。

### 支持的样式属性

| 属性 | 值格式 | 说明 | 示例 |
|---|---|---|---|
| `color` | `$colors.xxx` 或 `#hex` | 前景色 | `color = "$colors.text"` |
| `background` | `$colors.xxx` 或 `#hex` | 背景色 | `background = "$colors.surface"` |
| `font` | `$typography.xxx` | 排版 | `font = "$typography.body"` |
| `spacing` | `$spacing.xxx` 或数字 | 间距（仅 Stack） | `spacing = "$spacing.medium"` |
| `padding` | `$spacing.xxx` 或数字 | 内边距 | `padding = "$spacing.large"` |
| `cornerRadius` | `$radius.xxx` 或数字 | 圆角 | `cornerRadius = "$radius.small"` |
| `border` | `"宽度,$colors.xxx"` 或 `"宽度,#hex"` | 边框 | `border = "1,$colors.divider"` |
| `w` | `"infinity"` 或数字 | 宽度 | `w = "infinity"` |
| `h` | `"infinity"` 或数字 | 高度 | `h = "infinity"` |

### 示例

定义 `[styles.VStack]` 的 border 后，所有 VStack 自动带上边框，无需手动写 `.border()`：

```toml
[styles.VStack]
spacing = "$spacing.medium"
padding = "$spacing.large"
border = "1,$colors.divider"
w = "infinity"
h = "infinity"
```

```ae
// AE 代码 — 无需手动写 .border()
VStack(spacing=0) {
    Text("Hello")
}

// 生成的 Swift — border 和 frame 自动附加
VStack(spacing: 0) {
    Text("Hello")
}.overlay(RoundedRectangle(cornerRadius: 4).stroke(AppColors.divider, lineWidth: 1))
.frame(maxWidth: .infinity, alignment: .leading)
.frame(maxHeight: .infinity)
```

如果某个 VStack 需要不同边框，手动覆盖即可：

```ae
// 手动覆盖全局样式
VStack { ... }.border(2, "#E5E7EB")
```

如果全局样式设了 `w = "infinity"`，但某个容器需要按内容自适应宽度，使用 `.w(auto)` 覆盖：

```ae
// 全局: w = "infinity" → 自动撑满
VStack { ... }

// 覆盖: .w(auto) → 按内容适配宽度，不生成 .frame(maxWidth: .infinity)
VStack { ... }.w(auto)

// 同理，.h(auto) 覆盖全局 h = "infinity"
HStack { ... }.h(auto)
```

## 排版字重

`weight` 字段支持以下值：

| weight 值 | 说明 |
|---|---|
| `regular` | 常规 |
| `normal` | 常规（`regular` 的别名） |
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

组件默认样式通过 `[styles.Xxx]` 节定义，自动应用到所有该类型组件：

```ae
Text("自动应用样式")   // 自动应用 [styles.Text] 中定义的 color 和 font
VStack { ... }         // 自动应用 [styles.VStack] 中定义的 border
```

## 生成 Swift 代码

构建系统根据 theme.toml 生成以下 Swift 类型：

```swift
// 颜色 — 自动支持 light/dark 切换
struct AppColors {
    static var primary: Color    // 根据 traitCollection 返回对应色值
    static var text: Color
    static var background: Color
    static var surface: Color
    static var divider: Color
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
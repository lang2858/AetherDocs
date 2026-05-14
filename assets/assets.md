# 资源系统

Aether 的资源系统管理 SVG 图片等静态资源，支持目录嵌套，在 AE 模板中以 `$assets.xxx` 语法引用，构建时自动复制到 Assets.xcassets。

## 资源目录

将 SVG 文件放置在 `src/assets/` 目录下，支持子目录嵌套：

```
src/assets/
├── logo.svg
├── icons/
│   ├── home.svg
│   ├── settings.svg
│   └── arrow_right.svg
├── tabs/
│   ├── discover.svg
│   └── profile.svg
└── illustrations/
    └── empty_state.svg
```

## 命名规则

在 AE 模板中，使用点号 `.` 表示目录层级。编译器会将路径转换为 Swift 标识符：

| 规则 | 说明 |
|---|---|
| 目录层级分隔符 | 使用点号 `.`（如 `$assets.icons.home`） |
| 标识符转换 | 点号 `.` 在底层 Swift 代码中转换为下划线 `_` |
| 文件扩展名 | 去除 `.svg` 后缀 |

### 转换示例

| 文件路径 | AE 引用 | 生成 Swift |
|---|---|---|
| `src/assets/logo.svg` | `$assets.logo` | `AppAssets.logo` |
| `src/assets/icons/home.svg` | `$assets.icons.home` | `AppAssets.icons_home` |
| `src/assets/icons/arrow_right.svg` | `$assets.icons.arrow_right` | `AppAssets.icons_arrow_right` |
| `src/assets/tabs/discover.svg` | `$assets.tabs.discover` | `AppAssets.tabs_discover` |
| `src/assets/illustrations/empty_state.svg` | `$assets.illustrations.empty_state` | `AppAssets.illustrations_empty_state` |

## AE 模板中的引用

### 基本引用

```ae
Image($assets.logo)
Image($assets.icons.home)
```

生成 Swift：

```swift
Image("logo")          // 来自 Assets.xcassets
Image("icons_home")    // 来自 Assets.xcassets
```

### 在组件中使用

```ae
HStack {
    Image($assets.icons.home)
    Text("首页" font=$typography.body)
}

Button("设置" onClick={Settings.open()}) {
    Image($assets.icons.settings)
}
```

### 动态资源引用

当图片名称由组件参数决定时，使用 `{参数名}` 语法：

```ae
component IconBtn(icon: String) {
    Button("Click" onClick={Home.on_click()}) {
        Image($assets.{icon})
    }
}
```

在组件展开时，`{icon}` 会被替换为实际传入的参数值，然后解析为对应的 `AppAssets.xxx` 标识符。

例如使用时：

```ae
IconBtn(icon="icons.home")
```

展开为：

```ae
Image($assets.icons.home)
```

最终生成 Swift：

```swift
Image(AppAssets.icons_home)
```

## 构建输出

构建系统处理资源的流程：

```
1. 扫描 src/assets/ 下所有 SVG 文件
2. 每个 SVG 文件生成对应的 Assets.xcassets Image Set
3. 生成 AppAssets 结构体，提供类型安全的资源引用
4. SVG 文件自动转换为 XCAsset 的 Native Image Set 格式
```

### 生成的 AppAssets 结构体

```swift
struct AppAssets {
    static let logo = "logo"
    static let icons_home = "icons_home"
    static let icons_settings = "icons_settings"
    static let icons_arrow_right = "icons_arrow_right"
    static let tabs_discover = "tabs_discover"
    static let tabs_profile = "tabs_profile"
    static let illustrations_empty_state = "illustrations_empty_state"
}
```

### Assets.xcassets 目录结构

```
Assets.xcassets/
├── logo.imageset/
│   ├── logo.svg
│   └── Contents.json
├── icons_home.imageset/
│   ├── icons_home.svg
│   └── Contents.json
├── icons_settings.imageset/
│   ├── icons_settings.svg
│   └── Contents.json
└── ...
```

## SF Symbols 动态资源

Aether 内置了 SF Symbols 的按需下载机制。当 AE 模板中的 `Icon(systemName="house.fill")` 引用了本地资源中不存在的 SF Symbol 时，构建系统会自动从 GitHub 仓库下载对应的 SVG 文件到项目中。

### 工作原理

```
1. 构建时扫描所有 Icon/IconButton 组件的 systemName 属性
2. 过滤出字面量名称（排除 $变量、{state}、#param 等动态引用）
3. 对比已有资源，找出缺失的 SF Symbol
4. 从 GitHub 仓库下载 light 和 dark 两种变体的 SVG
5. 存储到 src/assets/sf/ 和 src/assets/sf-dark/
6. 重新扫描资源目录，注册新资源
```

### 资源目录结构

下载的 SF Symbol SVG 文件按 light/dark 变体分目录存储：

```
src/assets/
├── sf/                    ← light 变体
│   ├── house.fill.svg
│   ├── star.fill.svg
│   └── gearshape.fill.svg
└── sf-dark/               ← dark 变体
    ├── house.fill.svg
    ├── star.fill.svg
    └── gearshape.fill.svg
```

### 变体选择逻辑

构建系统根据主题推断外观，选择对应变体：

| 主题外观 | 使用的资源 | 资源名 |
|----------|-----------|--------|
| 浅色（light） | `src/assets/sf/` | `sf.house.fill` |
| 深色（dark） | `src/assets/sf-dark/` | `sf-dark.house.fill` |

推断规则：文字颜色偏亮 → 深色背景 → 使用 dark SVG；文字颜色偏暗 → 浅色背景 → 使用 light SVG。

### AE 模板中使用

```ae
// 直接使用 SF Symbol 名称 — 构建时自动下载
Icon(name="house.fill" size=20 color=$colors.primary)
Icon(name="star.fill" size=16 color=$colors.accent)
```

首次构建时，控制台会显示下载日志：

```
  ✓ SF Symbol: sf/house.fill.svg → fetched
  ✓ SF Symbol: sf-dark/house.fill.svg → fetched
  ✓ SF Symbol: sf/star.fill.svg (already in assets)
```

### 网络失败处理

如果下载失败（网络不可用、Symbol 名称不存在等），构建不会中断，只会输出警告：

```
  ⚠️  SF Symbol sf/nonexistent.svg: 'nonexistent' 不存在于仓库
  ⚠️  SF Symbol sf/house.fill.svg: 网络请求失败: connection refused
```

### 动态图标名称

当图标名称由组件参数决定时（如 `{icon}`），构建系统无法预知具体名称，不会自动下载。此时需要手动将 SVG 放入 `src/assets/sf/` 目录：

```ae
component DynIcon(icon: String) {
    Icon(name={icon} size=20)
}
```

### SVG 来源仓库

SF Symbol SVG 文件来自 GitHub 仓库：`lang2858/SF-Symbol`

目录结构为：

```
SF-Symbol/
├── light/       ← light 变体 SVG
│   ├── house.fill.svg
│   └── ...
└── dark/        ← dark 变体 SVG
    ├── house.fill.svg
    └── ...
```

## 最佳实践

| 建议 | 说明 |
|---|---|
| 按功能分目录 | 将图标、插画、Tab 图标等分目录放置，生成更有语义的标识符 |
| 使用小写+下划线命名 | 文件名使用 `snake_case`，如 `arrow_right.svg` |
| 控制 SVG 尺寸 | 优化 SVG 文件大小，移除不必要的元数据 |
| 避免文件名冲突 | 不同目录下不要放置同名文件，避免标识符冲突 |
| SF Symbol 优先 | 优先使用 SF Symbol 名称（如 `star.fill`），框架会自动处理下载和适配 |
| 首次构建需联网 | 使用新 SF Symbol 时，首次构建需要网络连接下载 SVG |

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

构建系统将文件路径转换为 Swift 标识符，规则如下：

| 规则 | 说明 |
|---|---|
| 目录分隔符 `.` | 转换为下划线 `_` |
| 文件扩展名 | 去除 `.svg` 后缀 |

### 转换示例

| 文件路径 | 生成的标识符 |
|---|---|
| `src/assets/logo.svg` | `AppAssets.logo` |
| `src/assets/icons/home.svg` | `AppAssets.icons_home` |
| `src/assets/icons/arrow_right.svg` | `AppAssets.icons_arrow_right` |
| `src/assets/tabs/discover.svg` | `AppAssets.tabs_discover` |
| `src/assets/illustrations/empty_state.svg` | `AppAssets.illustrations_empty_state` |

## AE 模板中的引用

### 基本引用

```ae
Image($assets.logo)
Image($assets.icons_home)
```

生成 Swift：

```swift
Image("logo")          // 来自 Assets.xcassets
Image("icons_home")    // 来自 Assets.xcassets
```

### 在组件中使用

```ae
HStack {
    Image($assets.icons_home)
    Text("首页" font=$typography.body)
}

Button("设置" onClick={Settings.open()}) {
    Image($assets.icons_settings)
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
IconBtn(icon="icons_home")
```

展开为：

```ae
Image($assets.icons_home)
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

## 最佳实践

| 建议 | 说明 |
|---|---|
| 按功能分目录 | 将图标、插画、Tab 图标等分目录放置，生成更有语义的标识符 |
| 使用小写+下划线命名 | 文件名使用 `snake_case`，如 `arrow_right.svg` |
| 控制 SVG 尺寸 | 优化 SVG 文件大小，移除不必要的元数据 |
| 避免文件名冲突 | 不同目录下不要放置同名文件，避免标识符冲突 |

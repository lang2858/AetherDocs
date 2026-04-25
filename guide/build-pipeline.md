# 构建流水线

Aether 的构建过程从 `.ae` + `.rs` 源文件到最终原生应用，共经历 10 个步骤。理解整个流水线有助于排查构建问题和定制构建行为。

## 流水线概览

```
aether.toml + .ae + .rs + themes + i18n + assets
        │
        ▼
┌─────────────────────────────────────────────┐
│  1.  加载配置 — 解析 aether.toml             │
│  2.  提取 Rust 模块 — 解析所有 .rs 文件      │
│  3.  验证绑定 — 检查 onClick 引用是否有效     │
│  4.  生成 UniFFI crate                       │
│  5.  cargo build — 编译 Rust 到动态库        │
│  6.  生成 UniFFI Swift 绑定                  │
│  7.  加载 themes / i18n / assets             │
│  8.  生成资源 Swift 文件                     │
│  9.  生成 Xcode 项目                         │
│  10. 生成 SwiftUI 视图文件                   │
│  11. xcodebuild — 最终原生编译               │
└─────────────────────────────────────────────┘
        │
        ▼
    原生 .app 产物
```

## 各步骤详解

### 1. 加载配置

解析项目根目录下的 `aether.toml` 文件，读取应用名称、平台配置、权限声明、主题和国际化等设置。如果配置文件不存在或解析失败，将使用默认值。详见 [配置参考](/guide/config)。

### 2. 提取 Rust 模块

扫描 `src/logic/` 目录下的所有 `.rs` 文件，使用 [syn](https://crates.io/crates/syn) 库解析 Rust 语法，提取结构体定义、方法签名和参数信息。这些信息用于后续的绑定验证和代码生成。

### 3. 验证绑定

检查 `.ae` 文件中的所有绑定引用（如 `onClick={Home.on_click()}`），确认引用的模块名和方法名在对应的 `.rs` 文件中确实存在。如果验证失败，构建将中止并报告所有错误。

### 4. 生成 UniFFI crate

根据提取的 Rust 模块信息，在构建输出目录生成一个完整的 UniFFI crate，包含：

- `Cargo.toml` — crate 配置，声明 uniffi 依赖
- `build.rs` — 构建脚本
- `src/lib.rs` — 带 `#[uniffi::export]` 属性的库文件，将所有 Rust 结构体和方法暴露给原生平台

### 5. cargo build

在生成的 UniFFI crate 目录下执行 `cargo build`，编译 Rust 代码为动态链接库 `lib<name>.dylib`。使用 `--release` 参数可进行优化构建。

### 6. 生成 UniFFI Swift 绑定

使用 `uniffi-bindgen` 工具，从编译好的动态库生成 Swift 语言绑定代码，使 Swift/SwiftUI 可以直接调用 Rust 逻辑。

### 7. 加载 themes / i18n / assets

加载项目资源文件：

- `src/themes/` — 所有主题配置（`.toml`）
- `src/i18n/` — 所有语言翻译（`.toml`）
- `src/assets/` — 所有 SVG 图标资源

### 8. 生成资源 Swift 文件

基于加载的资源，生成一系列 Swift 管理类，包括：

| 文件 | 说明 |
|------|------|
| `ThemeManager.swift` | 主题管理，颜色/字体/间距常量 |
| `I18nManager.swift` | 国际化文本管理 |
| `AppAssets.swift` | SVG 图标资源引用 |
| `SystemUI.swift` | 系统级 UI 能力（Toast、Dialog） |
| `Navigation.swift` | 导航路由管理 |
| `Storage.swift` | 本地存储 |
| `Device.swift` | 设备信息 |
| `Platform.swift` | 平台检测 |

### 9. 生成 Xcode 项目

在构建输出目录生成 `.xcodeproj` 项目文件（含 `.pbxproj`、`project.yml`、scheme 等），将 UniFFI 绑定、资源 Swift 文件、SwiftUI 视图文件等组织到一个完整的 Xcode 项目中。所有源文件位于同一个 target 内，无需跨模块 `import`。

### 10. 生成 SwiftUI 视图文件

将每个 `.ae` 文件转换为对应的 SwiftUI 视图文件（`.swift`）。一个 `.ae` 文件生成一个 `.swift` 文件，组件 `.ae` 文件生成可复用的 SwiftUI 组件。

### 11. xcodebuild

最终步骤，调用 `xcodebuild` 编译完整的原生应用。不同平台使用不同的目标：

| 平台 | xcodebuild destination |
|------|----------------------|
| macOS | `platform=macOS` |
| iPhone | `platform=iOS Simulator,name=iPhone 14` |
| iPad | `platform=iOS Simulator,name=iPad (10th generation)` |

构建成功后，`.app` 产物位于 `gen/<platform>/DerivedData/Build/Products/Debug/` 目录中。CLI 会在构建完成后打印产物路径和运行命令。

## 未来后端

当前只有 SwiftUI 后端完整连通。代码库中已存在其他平台后端的代码生成器，但尚未接入构建流水线：

| 后端 | 模块 | 目标 |
|------|------|------|
| `ComposeGen` | `aether-codegen::compose` | Kotlin / Jetpack Compose（Android） |
| `ArkUIGen` | `aether-codegen::arkui` | HarmonyOS eTS / ArkUI |

这些后端将逐步接入，届时 `aether build --platform android` 和 `aether build --platform harmony` 将直接可用。

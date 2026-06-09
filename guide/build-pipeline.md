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
│  4.  能力检测 — 扫描 .ae/.rs 确定需要的能力  │
│  5.  生成 UniFFI crate（按能力过滤）         │
│  6.  cargo build — 编译 Rust 到动态库        │
│  7.  生成 UniFFI Swift 绑定                  │
│  8.  加载 themes / i18n / assets             │
│  9.  生成资源 Swift 文件（按能力过滤）       │
│  10. 生成 Xcode 项目                         │
│  11. 生成 SwiftUI 视图文件                   │
│  11a. 诊断检查 — 验证主题引用并报告错误     │
│  12. xcodebuild — 最终原生编译               │
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

### 4. 能力检测

扫描项目源文件，自动检测需要的能力（Capability）：

1. **AE 扫描** — 遍历 `src/ui/**/*.ae`，匹配组件名（如 `Map(`、`WebView(`、`TextField(`）→ 对应能力
2. **Rust 扫描** — 遍历 `src/logic/**/*.rs`，匹配 `sys_*` 函数前缀（如 `sys_storage_`、`sys_location_`）→ 对应能力
3. **合并** — 合并 AE 和 Rust 扫描结果，始终包含核心能力（SystemUI、Navigation、Theme、I18n）
4. **配置覆盖** — 应用 `aether.toml` 中 `[capabilities]` 的 `force_include` / `force_exclude`

检测结果决定后续步骤的条件生成行为：仅项目实际使用的 delegate、API 段落和框架导入才会被生成。对于简单项目（仅 VStack/Text/Button），Platform.swift 从 ~1900 行缩减到 ~400 行，lib.rs 从 ~1600 行缩减到 ~500 行。能力列表详见 [配置参考 → capabilities](/guide/config#capabilities)。

### 5. 生成 UniFFI crate（按能力过滤）

根据提取的 Rust 模块信息，在构建输出目录生成一个完整的 UniFFI crate，包含：

- `Cargo.toml` — crate 配置，声明 uniffi 依赖
- `build.rs` — 构建脚本
- `src/lib.rs` — 带 `#[uniffi::export]` 属性的库文件，将所有 Rust 结构体和方法暴露给原生平台

### 6. cargo build

在生成的 UniFFI crate 目录下执行 `cargo build`，编译 Rust 代码为动态链接库 `lib<name>.dylib`。使用 `--release` 参数可进行优化构建。

### 7. 生成 UniFFI Swift 绑定

使用 `uniffi-bindgen` 工具，从编译好的动态库生成 Swift 语言绑定代码，使 Swift/SwiftUI 可以直接调用 Rust 逻辑。

### 8. 加载 themes / i18n / assets

加载项目资源文件：

- `src/themes/` — 所有主题配置（`.toml`）
- `src/i18n/` — 所有语言翻译（`.toml`）
- `src/assets/` — 所有 SVG 图标资源

### 9. 生成资源 Swift 文件（按能力过滤）

基于加载的资源，生成一系列 Swift 管理类。其中 **AetherRuntime 静态文件** 已包含通用实现，通过 `#if AETHER_*` 条件编译标志按能力激活，不需要按应用生成。

#### Codegen 生成的文件

| 文件 | 说明 |
|------|------|
| `ThemeManager.swift` | 主题管理，颜色/字体/间距常量（按主题配置生成） |
| `I18nManager.swift` | 国际化文本管理（按翻译表生成） |
| `AppAssets.swift` | SVG 图标资源引用（按资源清单生成） |
| `Keyboard.swift` | KeyboardMonitor 扩展（仅当 `Keyboard` 能力激活时生成） |

#### AetherRuntime 静态文件（`#if AETHER_*` 条件编译）

| 文件 | 条件标志 | 说明 |
|------|---------|------|
| `AetherBridge.swift` | — | 委托注册中心，`registerAll()` 内部按 `#if` 分发 |
| `DelegateBridge.swift` | `AETHER_STORAGE`, `AETHER_FILE_PICKER` | Category C 委托实现（StorageDelegateImpl、FilePickerDelegateImpl） |
| `DrawerManager.swift` | `AETHER_DRAWER` | 抽屉状态管理 + DrawerDelegateImpl |
| `StorageManager.swift` | — | UserDefaults 存储管理 |
| `NavigationManager.swift` | — | 导航路由管理 |
| `SystemUIManager.swift` | — | Toast/Dialog 管理 |
| `ThemeManager.swift` (Runtime) | — | 运行时主题切换 |
| `I18nManager.swift` (Runtime) | — | 运行时语言切换 |
| `DeviceManager.swift` | — | 设备信息 |
| `KeyboardMonitor.swift` | — | 键盘事件监听基类 |
| `ToolbarHelper.swift` | `os(macOS)` | macOS 工具栏辅助（ToolbarButtonCenterizer、WindowAccessor） |

条件编译标志通过 Xcode 项目的 `SWIFT_ACTIVE_CONDITIONS` 构建设置注入，在下一步（步骤 10）中根据能力检测结果自动配置。

#### 三类委托架构

Aether 的系统 API 按调用方向分为三类：

| 类别 | 方向 | 机制 | 示例 |
|------|------|------|------|
| A (UI 自循环) | Rust → Swift | Rust stub 函数，Swift Manager 直接处理 | `sys_toast`, `sys_navigate`, `sys_dialog_show` |
| B (平台事件) | Swift → Rust | Swift 调 `sys_on_*` 桥接函数通知 Rust | `sys_on_key_down`, `sys_on_orientation_change` |
| C (双向回调) | 双向 | UniFFI `callback_interface` 生成 Swift protocol | `StorageDelegate`, `FilePickerDelegate`, `DrawerDelegate` |

Category A 的 stub 函数始终生成（Rust 侧），Category C 的实现放在 AetherRuntime 中用 `#if` 条件编译控制。

### 10. 生成 Xcode 项目

在构建输出目录生成 `.xcodeproj` 项目文件（含 `.pbxproj`、`project.yml`、scheme 等），将 UniFFI 绑定、资源 Swift 文件、AetherRuntime 静态源码、SwiftUI 视图文件等组织到一个完整的 Xcode 项目中。所有源文件位于同一个 target 内，无需跨模块 `import`。

根据能力检测结果，自动在 Xcode 项目的 `SWIFT_ACTIVE_CONDITIONS` 构建设置中添加对应的条件编译标志（如 `AETHER_STORAGE`、`AETHER_FILE_PICKER`、`AETHER_DRAWER`），控制 AetherRuntime 中 `#if AETHER_*` 代码段的编译。

### 11. 生成 SwiftUI 视图文件

将每个 `.ae` 文件转换为对应的 SwiftUI 视图文件（`.swift`）。一个 `.ae` 文件生成一个 `.swift` 文件，组件 `.ae` 文件生成可复用的 SwiftUI 组件。

当项目使用 `TextEditor(syntax="ae")` 时，框架层还会向 `Helpers.swift` 注入原生代码编辑器实现（`HighlightRule` + `AeTextView` + `AeCodeEditorView`），高亮规则数据从 `aether-lang` spec 自动提取并内嵌到 `AeTextView(...)` 参数中。这确保了代码编辑器的原生能力是跨平台共享的框架基础设施，具体高亮规则由 codegen 从 spec 数据生成。

### 11a. 诊断检查

在视图文件生成过程中，编译器验证所有主题引用（`$colors`、`$spacing`、`$radius`、`$typography`），检查令牌是否在主题配置中定义。发现错误时中断构建，不执行后续步骤。详见 [诊断系统](/guide/diagnostics)。

### 12. xcodebuild

最终步骤，调用 `xcodebuild` 编译完整的原生应用。不同平台使用不同的目标：

| 平台 | xcodebuild destination |
|------|----------------------|
| macOS | `platform=macOS` |
| iPhone | `platform=iOS Simulator,name=iPhone 14` |
| iPad | `platform=iOS Simulator,name=iPad (10th generation)` |

构建成功后，`.app` 产物位于 `gen/<platform>/DerivedData/Build/Products/Debug/` 目录中。CLI 会在构建完成后打印产物路径和运行命令。

## 未来后端

当前 SwiftUI (macOS/iOS) 和 Web (WASM) 后端已完整连通。代码库中已存在其他平台后端的代码生成器，正在接入构建流水线：

| 后端 | 模块 | 目标 | 状态 |
|------|------|------|------|
| `SwiftUI` | `aether-codegen::swift_platform` | SwiftUI（macOS / iOS） | **生产可用** |
| `Web` | `aether-codegen::web_platform` | HTML + WASM | **生产可用** |
| `Windows` | `aether-codegen::windows_platform` | Python / PyQt6 | **生产可用** |
| `微信小程序` | `aether-codegen::wechat_platform` | WXML/WXSS/JS + Skyline | **生产可用** |
| `Android` | `aether-codegen::android_platform` | Kotlin / Jetpack Compose | 代码就绪，接入中 |
| `Linux` | `aether-codegen::linux_platform` | Python / PyQt6 | 代码就绪，接入中 |
| `HarmonyOS` | `aether-codegen::harmony_platform` | ArkUI | 开发中 |

这些后端逐步接入后，`aether build --platform android`、`aether build --platform linux` 和 `aether build --platform harmony` 将直接可用。

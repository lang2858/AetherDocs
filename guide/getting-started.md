# 快速开始

## Why Aether?

Aether 是一个声明式跨平台原生应用开发框架。开发者用 AE 标记语言编写 UI，用 Rust 编写逻辑，编译器静态转译为各平台原生代码，零运行时开销：

- **声明式 UI**: AE 标记语言描述界面，组件化、可复用、主题令牌化
- **Rust 逻辑层**: 业务逻辑用 Rust 编写，UniFFI 自动生成跨语言绑定
- **多平台输出**: macOS/iOS (SwiftUI) · Android (Compose) · Windows/Linux (PyQt6) · Web (WASM) · 微信小程序 · HarmonyOS (ArkUI)

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

### 通用依赖

| 工具 | 最低版本 | 安装方式 | 验证命令 |
|------|---------|---------|---------|
| Rust | 1.70+ | [rustup.rs](https://rustup.rs) | `rustc --version` |
| Cargo | 随 Rust 安装 | 同上 | `cargo --version` |

### Apple 平台（macOS / iPhone / iPad）

| 工具 | 最低版本 | 安装方式 | 验证命令 |
|------|---------|---------|---------|
| Xcode | 14.0+ | Mac App Store | `xcodebuild -version` |
| Xcode Command Line Tools | — | `xcode-select --install` | `xcode-select -p` |

> **为什么用 Xcode 而不是 Swift Package Manager？**
>
> Aether 使用 Xcode 原生项目（`.xcodeproj`）构建，而非 SPM（`swift build`）。原因：
>
> 1. **资源打包**：Xcode 项目通过 `Bundle.main` 访问 Assets Catalog 和其他资源，SPM 的 `.module` bundle 在原生 app target 中不可用。
> 2. **单 target 架构**：Aether 将所有 Swift 源文件（UniFFI 绑定、资源管理、SwiftUI 视图）放在同一个 Xcode target 中，无需跨模块 import，避免了 SPM 模块边界的复杂性。
> 3. **完整构建能力**：`xcodebuild` 支持 signing、entitlements、Info.plist、Assets Catalog 等 iOS/macOS 应用打包所需的全部功能，SPM 仅适合库开发。
> 4. **调试支持**：Xcode 原生项目可直接用 Xcode IDE 打开调试，断点、性能分析等工具开箱即用。

### Android 平台（未来支持）

需要 Android SDK 和 JDK，具体要求待定。

### 其他平台（未来支持）

Windows / Linux / HarmonyOS / Web 的环境要求待定。

---

## 安装 Aether CLI

从源码编译安装 Aether CLI：

```bash
cargo install --path source/crates/aether-cli
```

安装完成后，确认 CLI 可用：

```bash
aether --version
```

## 创建项目

使用 `aether init` 创建新项目：

```bash
aether init myapp
```

也可以指定项目路径和模板：

```bash
aether init myapp --path ~/projects --template basic
```

可用的模板（`--template`）：`blank`（空白项目）、`basic`（基础示例）、`todo`（待办事项示例）。

CLI 会自动生成完整的项目目录结构，包括 UI 文件、逻辑文件、主题和国际化配置。

## 项目目录结构概览

```
myapp/
  aether.toml              # 项目配置文件
  src/
    ui/
      home.ae              # 首页 UI 定义
      routes.ae            # 导航配置
    logic/
      home.rs              # 首页 Rust 逻辑
    themes/
      light.toml           # 浅色主题
      dark.toml            # 深色主题
    i18n/
      zh-CN.toml           # 中文翻译
      en.toml              # 英文翻译
    assets/
      *.svg                # SVG 图标资源
```

详细的目录结构说明请参考 [项目结构](/guide/project-structure)。

## 构建项目

进入项目目录后，使用 `aether build` 构建项目：

```bash
aether build --project myapp --platform macos
```

使用 `--release` 参数进行 Release 构建：

```bash
aether build --project myapp --platform macos --release
```

构建过程会自动完成 Rust 编译、UniFFI 绑定生成、SwiftUI 代码生成和 Xcode 编译。构建完成后会打印 `.app` 产物路径。详见 [构建流水线](/guide/build-pipeline)。

## 转译项目（仅生成代码，不编译）

如果只需要生成 UniFFI crate 和平台代码，不执行编译：

```bash
aether trans --project myapp --platform macos
```

输出目录默认为项目下的 `gen/macos/`。

使用 `--platform` 参数指定目标平台（默认为当前系统平台）：

```bash
aether trans --project myapp --platform iphone
```

## 运行应用

构建成功后，CLI 会打印 `.app` 产物的具体路径。macOS 平台可以直接运行：

```bash
open gen/macos/DerivedData/Build/Products/Debug/MyappApp.app
```

也可以用 Xcode 打开生成的项目进行调试：

```bash
open gen/macos/MyappApp.xcodeproj
```

## 支持的平台

### 当前可用

| 平台 | 参数 | 说明 |
|------|------|------|
| macOS | `macos` | 桌面应用 — 生产可用 |
| iPhone | `iphone` | iOS 手机应用 |
| iPad | `ipad` | iOS 平板应用 |
| Web | `web` | Web 应用 (WASM + HTML) — 生产可用 |
| Windows | `windows` | Windows 桌面应用 (PyQt6) — 生产可用 |
| 微信小程序 | `wechat` | 微信小程序应用 |

### 代码已就绪（接入中）

| 平台 | 参数 | 说明 |
|------|------|------|
| Android | `android` | 安卓应用 (Jetpack Compose) |
| Linux | `linux` | Linux 桌面应用 (PyQt6) |

### 开发中

| 平台 | 参数 | 说明 |
|------|------|------|
| HarmonyOS | `harmony` | 鸿蒙应用 (ArkUI) |

## CLI 命令参考

### aether init

创建新的 Aether 项目。

```bash
aether init <name> [--path <dir>] [--template <template>]
```

| 参数 | 说明 |
|------|------|
| `<name>` | 项目名称，必填 |
| `--path <dir>` | 项目路径，默认为当前目录下的 `<name>` 子目录 |
| `--template, -t <template>` | 项目模板：`blank`（默认）、`basic`、`todo` |

### aether build

编译 Aether 项目，生成原生应用。

```bash
aether build [--project <dir>] [--platform <platform>] [--build-dir <dir>] [--release] [--force]
```

| 参数 | 说明 |
|------|------|
| `--project, -p <dir>` | 项目路径，默认为当前目录 `.` |
| `--platform <platform>` | 目标平台，默认为当前系统平台 |
| `--build-dir <dir>` | 构建输出路径，默认为项目下的 `gen` |
| `--release` | Release 构建模式（默认为 debug） |
| `--force` | 强制全量构建，跳过增量编译缓存 |

可用的 platform 值：`macos`、`iphone`、`ipad`、`web`、`android`、`windows`、`linux`、`wechat`

### aether trans

转译 Aether 项目，生成 UniFFI crate 和平台代码（不执行编译）。

```bash
aether trans [--project <dir>] [--build-dir <dir>] [--platform <platform>]
```

| 参数 | 说明 |
|------|------|
| `--project, -p <dir>` | 项目路径，默认为当前目录 `.` |
| `--build-dir <dir>` | 构建输出路径，默认为项目下的 `gen` |
| `--platform <platform>` | 目标平台，默认为当前系统平台 |

可用的 platform 值：`macos`、`iphone`、`ipad`、`web`、`android`、`windows`、`linux`、`wechat`

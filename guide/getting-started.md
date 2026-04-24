# 快速开始

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

也可以指定项目路径：

```bash
aether init myapp --path ~/projects
```

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

构建过程会自动完成 Rust 编译、UniFFI 绑定生成、SwiftUI 代码生成和 Xcode 编译。详见 [构建流水线](/guide/build-pipeline)。

## 运行应用

构建成功后，`.app` 产物位于构建输出目录中。macOS 平台可以直接双击运行，或通过命令行启动：

```bash
open gen/macos/DerivedData/Build/Products/Debug/MyappApp.app
```

## 支持的平台

### 当前可用

| 平台 | 参数 | 说明 |
|------|------|------|
| macOS | `macos` | 桌面应用 |
| iPhone | `iphone` | iOS 手机应用 |
| iPad | `ipad` | iOS 平板应用 |

### 未来支持

| 平台 | 参数 | 说明 |
|------|------|------|
| Android | `android` | 安卓手机应用 |
| Android Pad | `android-pad` | 安卓平板应用 |
| Windows | `windows` | Windows 桌面应用 |
| Linux | `linux` | Linux 桌面应用 |
| HarmonyOS | `harmony` | 鸿蒙手机应用 |
| HarmonyOS Pad | `harmony-pad` | 鸿蒙平板应用 |
| Web | `web` | Web 应用 |

## CLI 命令参考

### aether init

创建新的 Aether 项目。

```bash
aether init <name> [--path <dir>]
```

| 参数 | 说明 |
|------|------|
| `<name>` | 项目名称，必填 |
| `--path <dir>` | 项目路径，默认为当前目录下的 `<name>` 子目录 |

### aether build

编译 Aether 项目，生成原生应用。

```bash
aether build [--project <dir>] [--platform <platform>] [--release]
```

| 参数 | 说明 |
|------|------|
| `--project <dir>` | 项目路径，默认为当前目录 `.` |
| `--platform <platform>` | 目标平台，默认为 `macos` |
| `--release` | Release 构建模式（默认为 debug） |

可用的 platform 值：`macos`、`iphone`、`ipad`、`android`、`android-pad`、`windows`、`linux`、`harmony`、`harmony-pad`、`web`

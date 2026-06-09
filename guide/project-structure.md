# 项目结构

Aether 项目采用 UI 与逻辑分离的架构，`.ae` 文件负责声明式 UI，`.rs` 文件负责业务逻辑，通过文件名自动配对绑定。

## 完整目录结构

```
myapp/
  aether.toml                 # 项目配置文件
  src/
    ui/
      home.ae                 # 首页 UI（每个 .ae 文件对应一个页面）
      detail.ae               # 详情页 UI
      routes.ae               # 导航配置（特殊文件）
      drawers.ae              # 抽屉定义（特殊文件）
      components/             # 可复用组件目录
        card.ae               # Card 组件
    logic/
      home.rs                 # 首页逻辑（与 home.ae 配对）
      detail.rs               # 详情页逻辑（与 detail.ae 配对）
    themes/
      light.toml              # 浅色主题
      dark.toml               # 深色主题
    i18n/
      zh-CN.toml              # 中文翻译
      en.toml                 # 英文翻译
    assets/
      *.svg                   # SVG 图标资源（支持子目录）
      fonts/                  # 自定义字体目录（可选）
        *.ttf                 # TrueType 字体文件
        *.otf                 # OpenType 字体文件
```

## 核心约定

### .ae 与 .rs 一一配对

`src/ui/` 下的 `.ae` 文件和 `src/logic/` 下的 `.rs` 文件通过**文件名**自动配对：

| UI 文件 | 逻辑文件 | 说明 |
|---------|---------|------|
| `src/ui/home.ae` | `src/logic/home.rs` | 文件名相同，自动绑定 |
| `src/ui/detail.ae` | `src/logic/detail.rs` | 文件名相同，自动绑定 |

在 `.ae` 文件中通过 Rust 结构体名称引用逻辑方法：

```ae
VStack {
    Text("Hello!")
    Button("Click me" onClick={Home.on_click()})
}
```

其中 `Home` 是 `home.rs` 中定义的 Rust 结构体名称。

### Rust 结构体名称用于绑定解析

`.rs` 文件中的 **Rust 结构体名称**（不是文件名）是绑定的关键标识。例如在 `home.rs` 中：

```rust
pub struct Home {
    count: i32,
}

impl Home {
    pub fn new() -> Self {
        Self { count: 0 }
    }

    pub fn on_click(&mut self) {
        self.count += 1;
    }
}
```

`.ae` 文件中通过 `Home.on_click()` 来引用这个方法。构建时 Aether 会验证所有绑定引用是否存在于对应的 `.rs` 模块中。

### routes.ae -- 导航配置

`routes.ae` 是一个**特殊文件**，用于定义应用的导航结构，不会被生成为独立的页面视图。它定义了 Tab 导航、页面路由等全局导航配置：

```ae
Routes {
    Tabs {
        Tab(icon="house" label="首页") { Home }
    }
}
```

### drawers.ae -- 抽屉定义

`drawers.ae` 也是一个**特殊文件**，用于定义侧边抽屉、底部弹出面板等容器。与 `routes.ae` 类似，它不会被生成为独立页面，而是作为全局 UI 组件注册。

### components/ 目录 -- 可复用组件

`src/ui/components/` 目录下的每个 `.ae` 文件定义一个可复用组件。文件名会自动转换为 **PascalCase** 组件名：

| 文件路径 | 组件名 |
|---------|--------|
| `components/card.ae` | `Card` |
| `components/nav_bar.ae` | `NavBar` |
| `components/user_avatar.ae` | `UserAvatar` |

组件定义使用 `component` 关键字，支持参数和默认值：

```ae
component ActionButton(icon, label, onClick, nameColor="$colors.text_on_primary", width=220) {
    HStack(spacing=8) {
        Icon(name="{icon}" size=16)
        Text("{label}" size=14 color="{nameColor}")
    }
    .h(40)
    .w({width})
    .bg("$colors.accent")
    .onClick({onClick})
}
```

在页面 `.ae` 文件中通过 **`:Name()`** 语法调用自定义组件：

```ae
VStack {
    :ActionButton(icon="star" label="收藏" onClick={Home.on_favorite()})
}
```

除了 `components/` 目录中的独立文件，也可以在页面 `.ae` 文件内**内联定义**组件：

```ae
component StatusBar() {
    HStack(spacing=8) {
        Text("Ready").size(12).color("#9CA3AF")
        Spacer()
    }
    .h(24)
    .pad(left=12, right=12)
    .bg("#1E1E1E")
}

VStack(spacing=0) {
    :StatusBar()
    Text("Hello!")
}
```

> 详细的组件定义、调用和参数替换规则参见 [自定义组件](../ae/custom-component.md)。

## 其他目录

### themes/ -- 主题配置

每个 `.toml` 文件定义一个主题，文件名即为主题名（如 `light.toml` 定义 `light` 主题）。主题包含颜色、字体、间距、圆角和样式等配置。

### i18n/ -- 国际化

每个 `.toml` 文件对应一种语言，文件名即为 locale 标识（如 `zh-CN.toml`）。在 `.ae` 文件中通过 `@i18n.key` 引用翻译文本。

### assets/ -- 静态资源

目前支持 `.svg` 格式的图标资源，支持子目录组织。在 `.ae` 文件中通过 `$assets.icon_name` 引用。子目录使用 `.` 分隔，例如 `assets/tab/home.svg` 对应 `$assets.tab.home`。

#### 自定义字体

将 `.ttf` 或 `.otf` 字体文件放入 `src/assets/fonts/` 目录，框架会自动：
1. 复制字体文件到 Xcode 项目的 App Target 目录
2. 在 `Info.plist` 中注册字体路径（`ATSApplicationFontsPath`）
3. 在 Xcode 项目文件中添加字体文件引用

在 `.ae` 文件中使用 `.font("FontName:size")` 修饰符应用自定义字体：

```ae
Text("手写笔记").font("RYYCSXT:18").color($colors.text)
```

其中 `FontName` 是字体的 **PostScript 名称**（可通过 `fc-scan` 或 Font Book 查看）。

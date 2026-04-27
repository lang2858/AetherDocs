# Navigation / 路由与导航

---

## Toolbar

自定义 macOS 窗口标题栏，编译后会被提取并固定放置在窗口顶部，无论在 `.ae` 源码中的书写位置。

```ae
Toolbar(height=42 bg="#1E1E1E") {
    // 标题栏内容
}
```

**属性：**
- `height` — 标题栏高度，默认 42
- `bg` — 背景颜色，默认 `#1E1E1E`

**注意事项：**
- Toolbar 是系统级组件，编译时会自动提取并放置在窗口最顶部（titlebar 区域），不受源码中书写位置的影响
- Toolbar 无需手动包裹在 VStack 中，编译器会自动将其与页面内容组合为 `VStack(spacing: 0)`
- 双击标题栏会触发窗口缩放（zoom），该行为由编译器自动注入

---

Aether 的导航系统通过 `routes.ae` 和 `drawers.ae` 声明式配置，支持 Tabs、Stack、Split 等导航样式，以及多方向抽屉面板。

---

## Routes 块

在 `src/ui/routes.ae` 中定义应用的路由结构和导航方式。

### AE 示例

```ae
Routes {
    Tabs {
        Tab(icon="house" label="首页") { Home }
        Tab(icon="gear" label="设置") { Settings }
    }
    Stack {
        Detail(width=600 height=400)
    }
    Modal {
        Editor
    }
}
```

### 导航样式

| 样式 | 说明 | SwiftUI 对应 |
|------|------|--------------|
| auto | 自动选择（macOS 默认 tabs，iOS 默认 stack） | 条件编译 |
| tabs | Tab 导航，底部标签栏 | `TabView` |
| stack | 栈式导航，支持 push/pop | `NavigationStack` |
| split | 分栏导航（macOS 侧边栏） | `NavigationSplitView` |

### SwiftUI 输出（Tabs 模式）

```swift
struct MyAppView: View {
    @StateObject private var nav = NavigationManager.shared
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house")
                    Text("首页")
                }
                .tag(0)
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("设置")
                }
                .tag(1)
        }
    }
}
```

### SwiftUI 输出（Stack 模式）

```swift
struct MyAppView: View {
    @StateObject private var nav = NavigationManager.shared

    var body: some View {
        NavigationStack(path: $nav.path) {
            HomeView()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .detail:
                        DetailView()
                    }
                }
        }
    }
}
```

---

## Drawers 块

在 `src/ui/drawers.ae` 中声明抽屉面板。每个抽屉拥有独立的 `.ae` 文件（如 `menu_drawer.ae` → `MenuDrawer` 组件）。

### AE 示例

```ae
Drawers {
    MenuDrawer(id="menu" side="left" width=280 background="#FFFFFF")
    ActionPanel(id="actions" side="bottom" height=300 background="#F5F5F5")
}
```

### 抽屉方向

| 方向 | 说明 | SwiftUI 实现 |
|------|------|-------------|
| left | 左侧滑出 | `.offset(x:)` + 动画 |
| right | 右侧滑出 | `.offset(x:)` + 动画 |
| top | 顶部滑出 | `.offset(y:)` + 动画 |
| bottom | 底部滑出 | `.offset(y:)` + 动画 |

### 抽屉属性

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | str | 是 | — | 抽屉标识，用于打开/关闭控制 |
| side | enum | 是 | left | 方向：left / right / top / bottom |
| width | num | 否 | — | 左右抽屉的宽度 |
| height | num | 否 | — | 上下抽屉的高度 |
| background | str | 否 | — | 背景颜色 |

### SwiftUI 输出

```swift
// 抽屉状态管理
@ObservedObject private var drawerManager = DrawerManager.shared

// 抽屉修饰符（自动生成）
.overlay(
    ZStack {
        if drawerManager.menuOpen {
            Color.black.opacity(0.3)
                .onTapGesture { drawerManager.menuOpen = false }
            MenuDrawerView()
                .frame(width: 280)
                .background(Color.white)
                .transition(.move(edge: .leading))
        }
    }
    .animation(.easeInOut, value: drawerManager.menuOpen)
)
```

### 抽屉开关 API

在 Rust 逻辑中通过导航 API 控制抽屉：

```rust
// 打开抽屉
nav_drawer_open(id: "menu".to_string());

// 关闭抽屉
nav_drawer_close(id: "menu".to_string());

// 切换抽屉
nav_drawer_toggle(id: "menu".to_string());

// 检查是否打开
nav_drawer_is_open(id: "menu".to_string()) -> bool;
```

---

## NavigationStack

导航栈容器，支持 push/pop 导航。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| — | — | — | — | 无额外属性 |

支持子组件。

### AE 示例

```ae
NavigationStack {
    Home
}
```

---

## NavigationLink

导航链接，点击后 push 到目标页面。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| destination | str | 是 | — | 目标页面名称 |
| text | str | 否 | — | 链接文字 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onTap | `() => void` | 点击回调 |

支持子组件。

### AE 示例

```ae
NavigationLink(destination="Detail" text="查看详情")
```

### SwiftUI 输出

```swift
NavigationLink(destination: DetailView()) {
    Text("查看详情")
}
```

---

## TabBar

标签栏，底部标签导航。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| selected | num | 否 | 0 | 当前选中索引 |
| items | str | 否 | — | 标签项列表 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onChange | `(index: num) => void` | 切换标签回调 |

继承 `_style`。

---

## TabView

标签视图容器，包含多个 TabItem。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| selected | num | 否 | 0 | 当前选中索引 |

继承 `_style`。支持子组件。

---

## TabItem

单个标签项。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | str | 是 | — | 标签标题 |
| icon | str | 否 | — | 标签图标（SF Symbol 名称） |
| badge | num | 否 | — | 角标数字 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onTap | `() => void` | 点击回调 |

支持子组件。

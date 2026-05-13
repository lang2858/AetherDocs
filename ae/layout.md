# 布局组件参考

AE 布局组件用于组织页面的空间结构。所有布局组件均支持 `_style` 全局样式属性。

---

## VStack

垂直排列子组件的容器，类似 SwiftUI 的 `VStack`。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| spacing | num | 0 | 子组件之间的垂直间距 |
| alignX | enum | — | 水平（交叉轴）对齐：`start`（左）/ `center`（居中）/ `end`（右）。别名 `align_x` |
| alignY | enum | — | 垂直（主轴）对齐：`start`（顶）/ `center`（居中）/ `end`（底）。别名 `align_y` |
| align | enum | — | 同时设置两轴对齐的快捷方式，值同上。别名 `alignment` |
| justify | enum | — | 主轴排列：`start`（靠顶）/ `center`（居中）/ `end`（靠底） |
| wrap | enum | — | 换行模式：`nowrap`（不换行）/ `wrap`（换行）/ `wrapReverse`（反向换行） |

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击整个容器时触发 |

### 子组件

支持任意子组件。

### 示例

**AE 语法：**

```ae
VStack(spacing=12 align=start) {
    Text("第一行")
    Text("第二行")
    Text("第三行")
}
.pad(16)
.bg("#121622")
.radius(8)
```

**SwiftUI 输出：**

```swift
VStack(alignment: .leading, spacing: 12) {
    Text("第一行")
    Text("第二行")
    Text("第三行")
}
.padding(16)
.background(Color(hex: "#121622"))
.cornerRadius(8)
```

---

## HStack

水平排列子组件的容器，类似 SwiftUI 的 `HStack`。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| spacing | num | 0 | 子组件之间的水平间距 |
| alignX | enum | — | 水平（主轴）对齐：`start`（左）/ `center`（居中）/ `end`（右）。别名 `align_x` |
| alignY | enum | — | 垂直（交叉轴）对齐：`start`（顶）/ `center`（居中）/ `end`（底）。别名 `align_y` |
| align | enum | — | 同时设置两轴对齐的快捷方式，值同上。别名 `alignment` |
| justify | enum | — | 主轴排列：`start`（靠左）/ `center`（居中）/ `end`（靠右） |
| wrap | enum | — | 换行模式：`nowrap`（不换行）/ `wrap`（换行）/ `wrapReverse`（反向换行） |

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击整个容器时触发 |

### 子组件

支持任意子组件。

### 示例

**AE 语法：**

```ae
HStack(spacing=8 align=center) {
    Avatar(src=$assets.avatar size=36)
    VStack(spacing=4) {
        Text("用户名" size=14 weight="bold")
        Text("描述" size=12 color="#8A90A2")
    }
    Spacer()
    Icon(name="chevron.right" size=16 color="#8A90A2")
}
.pad(12)
```

**SwiftUI 输出：**

```swift
HStack(alignment: .center, spacing: 8) {
    Image("avatar").frame(width: 36, height: 36).clipShape(Circle())
    VStack(spacing: 4) {
        Text("用户名").font(.system(size: 14, weight: .bold))
        Text("描述").font(.system(size: 12)).foregroundColor(Color(hex: "#8A90A2"))
    }
    Spacer()
    Image(systemName: "chevron.right").font(.system(size: 16)).foregroundColor(Color(hex: "#8A90A2"))
}
.padding(12)
```

**justify 示例：**

```ae
HStack(spacing=10 justify="end") {
    Text("Build Succeeded")
    Icon(name="magnifyingglass")
    Icon(name="gearshape")
}
```

```swift
HStack(spacing: 10) {
    Spacer()
    Text("Build Succeeded")
    Image(systemName: "magnifyingglass")
    Image(systemName: "gearshape")
}
```

justify 通过在子元素前后插入 `Spacer()` 实现主轴排列：

| justify 值 | 生成逻辑 |
|-----------|---------|
| start | 不插入（默认行为） |
| center | 子元素前插 Spacer()，后插 Spacer() |
| end | 子元素前插 Spacer() |

---

## ZStack

层叠排列子组件的容器，子组件按书写顺序从底到顶堆叠，类似 SwiftUI 的 `ZStack`。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| spacing | num | 0 | 子组件之间的间距 |
| alignX | enum | — | 水平对齐：`start`（左）/ `center`（居中）/ `end`（右）。别名 `align_x` |
| alignY | enum | — | 垂直对齐：`start`（顶）/ `center`（居中）/ `end`（底）。别名 `align_y` |
| align | enum | — | 同时设置两轴对齐的快捷方式，值同上。别名 `alignment` |
| justify | enum | — | 主轴排列：`start` / `center` / `end` |
| wrap | enum | — | 换行模式：`nowrap` / `wrap` / `wrapReverse` |

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击整个容器时触发 |

### 子组件

支持任意子组件。

### 示例

**AE 语法：**

```ae
ZStack(align=center) {
    Image($assets.banner).w(200).h(120)
    Text("标题" size=20 weight="bold" color="#FFF")
}
.radius(12)
```

**SwiftUI 输出：**

```swift
ZStack {
    Image("banner").frame(width: 200, height: 120)
    Text("标题").font(.system(size: 20, weight: .bold)).foregroundColor(Color(hex: "#FFF"))
}
.cornerRadius(12)
```

---

## ScrollView

可滚动容器，支持垂直和水平方向滚动。编译器会自动为 ScrollView 内的直接子视图添加 `.frame(maxWidth: .infinity, alignment: .leading)`，确保内容左对齐并填满宽度（如果子视图已设置 `.w()` 或 `.frame(width:)` 则不会重复添加）。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| direction | enum | vertical | 滚动方向：`vertical`（垂直）/ `horizontal`（水平） |
| showsScrollIndicator | bool | true | 是否显示滚动条 |

### 事件

| 事件 | 说明 |
|------|------|
| onRefresh | 下拉刷新时触发 |

### 子组件

支持任意子组件。

### 示例

**AE 语法：**

```ae
ScrollView(.vertical) {
    VStack(spacing=12) {
        Text("内容1")
        Text("内容2")
        Text("内容3")
    }
    .pad(16)
}
```

水平滚动：

```ae
ScrollView(.horizontal showsScrollIndicator=false) {
    HStack(spacing=12) {
        Image($assets.pic1).w(200).h(150).radius(8)
        Image($assets.pic2).w(200).h(150).radius(8)
    }
    .pad(16)
}
```

**SwiftUI 输出：**

```swift
ScrollView(.vertical, showsIndicators: true) {
    VStack(spacing: 12) {
        Text("内容1")
        Text("内容2")
        Text("内容3")
    }
    .padding(16)
}
```

水平滚动输出：

```swift
ScrollView(.horizontal, showsIndicators: false) {
    HStack(spacing: 12) {
        Image("pic1").frame(width: 200, height: 150).cornerRadius(8)
        Image("pic2").frame(width: 200, height: 150).cornerRadius(8)
    }
    .padding(16)
}
```

---

## SplitView

可拖拽分隔线的分割视图，支持水平和垂直方向。在 macOS 上映射为 `AeSplitView`（基于 `HSplitView`/`VSplitView` 的自定义封装）。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| direction | enum | horizontal | 分割方向：`horizontal`（水平分割）/ `vertical`（垂直分割） |
| initialRatio | num | 0.5 | 初始分割比例（0.0-1.0） |
| minFirst | num | — | 第一个面板的最小尺寸（pt） |
| minSecond | num | — | 第二个面板的最小尺寸（pt） |
| collapsibleFirst | bool | false | 第一个面板是否可折叠 |
| collapsibleSecond | bool | false | 第二个面板是否可折叠 |
| secondCollapsed | binding | — | 绑定控制第二个面板是否折叠，如 `{EditorState.right_panel_collapsed}` |

### 事件

无。

### 子组件

支持两个子组件，分别对应左右/上下两个面板。

### 示例

**AE 语法：**

```ae
SplitView(direction="horizontal" initialRatio=0.3 minFirst=200) {
    // 左侧面板
    VStack {
        Text("导航栏")
    }
    
    // 右侧面板
    VStack {
        Text("内容区")
    }
}
```

**SwiftUI 输出：**

```swift
AeSplitView(direction: .horizontal, initialRatio: 0.3, minFirst: 200) {
    VStack {
        Text("导航栏")
    }
    VStack {
        Text("内容区")
    }
}
```

---

## View

通用容器组件，用于分组、点击交互或样式包裹。

### 属性

无专用属性。

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击时触发 |
| onLongPress | 长按时触发 |

### 子组件

支持任意子组件。

### 示例

**AE 语法：**

```ae
View(onTap={Detail.open()}) {
    HStack {
        Text("点击进入详情" size=14)
        Spacer()
        Icon(name="chevron.right" size=14 color="#8A90A2")
    }
    .pad(12)
}
.bg("#1E2333")
.radius(8)
```

**SwiftUI 输出：**

```swift
Button(action: {
    viewModel.logic.open()
}) {
    HStack {
        Text("点击进入详情").font(.system(size: 14))
        Spacer()
        Image(systemName: "chevron.right").font(.system(size: 14)).foregroundColor(Color(hex: "#8A90A2"))
    }
    .padding(12)
}
.background(Color(hex: "#1E2333"))
.cornerRadius(8)
```

---

## Spacer

弹性空白占位组件，占据父容器中剩余的可用空间。通常用于 `HStack` 或 `VStack` 中将其他组件推到两端。

### 属性

无。

### 事件

无。

### 子组件

不支持子组件。

### 示例

**AE 语法：**

```ae
HStack {
    Text("左侧" size=14)
    Spacer()
    Text("右侧" size=14 color="#8A90A2")
}
```

**SwiftUI 输出：**

```swift
HStack {
    Text("左侧").font(.system(size: 14))
    Spacer()
    Text("右侧").font(.system(size: 14)).foregroundColor(Color(hex: "#8A90A2"))
}
```

---

## Toolbar

自定义标题栏，替换 macOS 系统默认标题栏。不写 `Toolbar { }` 时使用系统默认标题栏。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| height | num | 42 | 标题栏高度 (pt) |
| bg | str | "#1E1E1E" | 标题栏背景色 |

### 事件

无。

### 子组件

支持任意子组件。内容完全自由：用户用 HStack/Spacer/Text/Icon 等组件自行布局。

### 示例

```ae
Toolbar(height=42 bg="#1E1E1E") {
    ZStack {
        ToolbarItem(position=center) {
            Text("Aether").size(14).semibold()
        }
        ToolbarItem(position=left) {
            Text("Aether").size(14).semibold()
            Text("MyApp").size(13)
        }
        ToolbarItem(position=right) {
            Icon(name="gearshape.fill" size=18)
            Text("ZB").size(12).bold()
        }
    }
}
```

### 布局建议

推荐使用 **ToolbarItem + ZStack 分层布局**：

- `ToolbarItem(position=center)` — 强制居中，内容前后自动插入 Spacer
- `ToolbarItem(position=left)` — 靠左排列，macOS 自动注入 70pt 红绿灯占位
- `ToolbarItem(position=right)` — 靠右排列，内容前自动插入 Spacer

三个 ToolbarItem 在 ZStack 中层叠，居中内容不会被左右区域挤压。

### macOS 生成代码

```swift
HStack(spacing: 0) { /* 用户内容 */ }
    .padding(.horizontal, 8)
    .background(Color(hex: "#1E1E1E"))
    .frame(height: 42)
    .clipped()
    .onTapGesture(count: 2) { NSApplication.shared.windows.first?.zoom(nil) }
```

使用自定义 Toolbar 时，App 层自动隐藏系统标题栏、红绿灯按钮垂直居中到自定义高度、使用 ZStack 替代 TabView 切换 tab、双击标题栏最大化窗口。

---

## Divider

分割线组件，用于在内容之间添加视觉分隔。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| orientation | enum | horizontal | 方向：`horizontal`（水平）/ `vertical`（垂直） |

### 事件

无。

### 子组件

不支持子组件。

### 示例

**AE 语法：**

```ae
VStack(spacing=0) {
    Text("上方内容" size=14)
    Divider().pad(top=8, bottom=8)
    Text("下方内容" size=14)
}
```

垂直分割线：

```ae
HStack(spacing=0) {
    Text("左侧")
    Divider().h(20).pad(left=8, right=8)
    Text("右侧")
}
```

**SwiftUI 输出：**

```swift
VStack(spacing: 0) {
    Text("上方内容").font(.system(size: 14))
    Divider().padding(.top, 8).padding(.bottom, 8)
    Text("下方内容").font(.system(size: 14))
}
```

垂直分割线输出：

```swift
HStack(spacing: 0) {
    Text("左侧")
    Divider().frame(height: 20).padding(.leading, 8).padding(.trailing, 8)
    Text("右侧")
}
```

---

## _style 全局样式属性

所有布局组件均支持以下全局样式属性（通过点修饰符设置）：

| 属性 | 修饰符 | 说明 |
|------|--------|------|
| 宽度 | `.w(N)` | 设置组件宽度 |
| 高度 | `.h(N)` | 设置组件高度 |
| 背景 | `.bg(color)` | 设置背景颜色 |
| 内边距 | `.pad(N)` 或 `.pad(top=T bottom=B left=L right=R)` | 设置内边距 |
| 外边距 | `.mar(N)` 或 `.mar(top=T bottom=B left=L right=R)` | 设置外边距 |
| 圆角 | `.radius(N)` | 设置圆角半径 |
| 透明度 | `.op(N)` | 设置透明度 (0-1) |
| 阴影 | `.shadow(...)` | 设置阴影 |
| 边框 | `.border(N)` 或 `.border(N, color)` | 设置边框 |

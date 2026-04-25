# 布局组件参考

AE 布局组件用于组织页面的空间结构。所有布局组件均支持 `_style` 全局样式属性。

---

## VStack

垂直排列子组件的容器，类似 SwiftUI 的 `VStack`。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| spacing | num | 0 | 子组件之间的垂直间距 |
| align | enum | center | 水平对齐方式：`start`（左对齐）/ `center`（居中）/ `end`（右对齐） |

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
| align | enum | center | 垂直对齐方式：`top`（顶部对齐）/ `center`（居中）/ `bottom`（底部对齐） |

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

---

## ZStack

层叠排列子组件的容器，子组件按书写顺序从底到顶堆叠，类似 SwiftUI 的 `ZStack`。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| align | enum | center | 对齐方式：`topStart`（左上）/ `center`（居中）/ `bottomEnd`（右下） |

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

工具栏组件，用于在 macOS 标题栏区域放置自定义按钮和内容。通常配合 `titlebar_style = "hidden"` 使用。

### 属性

无专用属性。

### 事件

无。

### 子组件

支持任意子组件，常用：`Icon`、`Text`、`Spacer`。

### 示例

**AE 语法：**

```ae
VStack(spacing=12) {
    Text("内容")
}
Toolbar {
    Icon(name="sidebar.left" size=16 color="#8A90A2")
        .onTap({Home.toggle_sidebar()})
    Spacer()
    Text("标题" size=14 weight="semibold")
    Spacer()
    Icon(name="gearshape" size=16 color="#8A90A2")
        .onTap({Home.open_settings()})
}
```

**SwiftUI 输出：**

```swift
VStack(spacing: 12) {
    Text("内容")
}
.toolbar {
    ToolbarItemGroup(placement: .principal) {
        HStack(spacing: 12) {
            Button(action: { viewModel.toggleSidebar() }) {
                Image(systemName: "sidebar.left").font(.system(size: 16)).foregroundColor(Color(hex: "#8A90A2"))
            }
            Spacer()
            Text("标题").font(.system(size: 14, weight: .semibold))
            Spacer()
            Button(action: { viewModel.openSettings() }) {
                Image(systemName: "gearshape").font(.system(size: 16)).foregroundColor(Color(hex: "#8A90A2"))
            }
        }
    }
}
```

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

# Gesture / 手势与交互

手势与交互组件为视图添加手势识别、滑动操作、下拉刷新、轮播和过渡动画能力。

---

## GestureDetector

手势检测器，包裹子组件并添加多种手势处理。所有手势通过事件属性声明。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| — | — | — | — | 手势通过事件属性定义，无独立 props |

| 事件 | 签名 | 说明 |
|------|------|------|
| onTap | `() => void` | 单击 |
| onDoubleTap | `() => void` | 双击 |
| onLongPress | `() => void` | 长按 |
| onSwipe | `(direction: str) => void` | 滑动，direction 为 left/right/up/down |
| onPinch | `(scale: num) => void` | 捏合缩放 |
| onDrag | `(dx: num, dy: num) => void` | 拖拽 |

继承 `_style`。支持子组件。

### AE 示例

```ae
GestureDetector(
    onTap={Home.on_card_tap()}
    onLongPress={Home.on_card_long_press()}
    onSwipe={Home.on_card_swipe()}
) {
    VStack(spacing=8) {
        Text("可交互卡片" size=16 weight="bold")
        Text("点击、长按或滑动试试" size=13 color="$colors.text_secondary")
    }
    .pad(16)
    .bg("#FFFFFF")
    .radius(12)
}
```

### SwiftUI 输出

```swift
VStack(spacing: 8) {
    Text("可交互卡片").font(.system(size: 16)).bold()
    Text("点击、长按或滑动试试").font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
}
.padding(16)
.background(Color.white)
.cornerRadius(12)
.onTapGesture { viewModel.onCardTap() }
.onTapGesture(count: 2) { viewModel.onCardLongPress() }  // DoubleTap
.onLongPressGesture { viewModel.onCardLongPress() }
.gesture(DragGesture().onEnded { value in
    let dx = value.translation.width
    let dy = value.translation.height
    viewModel.onCardSwipe(direction: ...)
})
.gesture(MagnificationGesture().onChanged { scale in
    viewModel.onCardPinch(scale: scale)
})
```

---

## Swipeable

可滑动组件，支持左右滑出操作按钮。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| leftActions | str | 否 | — | 左侧操作列表 |
| rightActions | str | 否 | — | 右侧操作列表 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onSwipe | `(direction: str) => void` | 滑动回调 |

继承 `_style`。支持子组件。

### AE 示例

```ae
Swipeable(leftActions="归档" rightActions="删除,标记") {
    ListItem(title="消息标题" subtitle="消息摘要")
}
```

### SwiftUI 输出

```swift
// 使用 SwiftUI 的 swipeActions 修饰符
HStack(spacing: 12) {
    Text("消息标题").font(.system(size: 16))
    Text("消息摘要").font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
}
.swipeActions(edge: .leading) {
    Button("归档") { /* ... */ }
}
.swipeActions(edge: .trailing) {
    Button("删除", role: .destructive) { /* ... */ }
    Button("标记") { /* ... */ }
}
```

---

## RefreshControl

下拉刷新控件，包裹可滚动内容。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| refreshing | bool | 否 | false | 当前是否正在刷新 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onRefresh | `() => void` | 触发刷新 |

继承 `_style`。支持子组件。

### AE 示例

```ae
RefreshControl(refreshing={Home.is_refreshing} onRefresh={Home.on_refresh()}) {
    List(data=viewModel.items) {
        ListItem(title="Item")
    }
}
```

### SwiftUI 输出

```swift
List(viewModel.items) { item in
    // ...
}
.refreshable {
    await viewModel.onRefresh()
}
```

---

## Carousel

轮播组件，自动播放或手动切换的横向滑动容器。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| index | num | 否 | 0 | 当前显示项索引 |
| autoPlay | bool | 否 | false | 是否自动播放 |
| interval | num | 否 | 3000 | 自动播放间隔（毫秒） |
| loop | bool | 否 | true | 是否循环播放 |
| showIndicators | bool | 否 | true | 是否显示指示器 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onChange | `(index: num) => void` | 切换回调 |

继承 `_style`。支持子组件。子组件使用 `CarouselItem` 包裹。

### CarouselItem

轮播项，无额外属性，继承 `_style`，支持子组件。

### AE 示例

```ae
Carousel(index=0 autoPlay=true interval=3000 loop=true showIndicators=true) {
    CarouselItem {
        Image(src=$assets.banner1 mode="fill")
    }
    CarouselItem {
        Image(src=$assets.banner2 mode="fill")
    }
    CarouselItem {
        Image(src=$assets.banner3 mode="fill")
    }
}
```

### SwiftUI 输出

```swift
TabView(selection: $currentCarouselIndex) {
    Image("banner1").resizable().aspectRatio(contentMode: .fill).tag(0)
    Image("banner2").resizable().aspectRatio(contentMode: .fill).tag(1)
    Image("banner3").resizable().aspectRatio(contentMode: .fill).tag(2)
}
.tabViewStyle(PageTabViewStyle(indexDisplayMode: .always))
.onReceive(timer) { _ in
    if autoPlay {
        currentCarouselIndex = (currentCarouselIndex + 1) % 3
    }
}
```

---

## Transition

过渡动画组件，控制子组件的显示/隐藏动画。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| show | bool | 是 | — | 是否显示 |
| type | enum | 否 | fade | 动画类型：fade / slide / scale / expand |
| duration | num | 否 | 300 | 动画时长（毫秒） |

继承 `_style`。支持子组件。

### 动画类型说明

| 类型 | 效果 | SwiftUI Transition |
|------|------|-------------------|
| fade | 淡入淡出 | `.opacity` |
| slide | 滑入滑出 | `.move(edge: .bottom)` |
| scale | 缩放 | `.scale` |
| expand | 展开/收起 | `.asymmetric(insertion: .move(edge: .bottom).combined(with: .opacity), removal: .move(edge: .bottom).combined(with: .opacity))` |

### AE 示例

```ae
Transition(show={Home.show_detail} type="slide" duration=300) {
    VStack(spacing=12) {
        Text("详细信息" size=18 weight="bold")
        Text("这里是详细内容" size=14 color="$colors.text_secondary")
    }
    .pad(20)
    .bg("#FFFFFF")
    .radius(12)
}
```

### SwiftUI 输出

```swift
if viewModel.showDetail {
    VStack(spacing: 12) {
        Text("详细信息").font(.system(size: 18)).bold()
        Text("这里是详细内容").font(.system(size: 14)).foregroundColor(AppColors.text_secondary)
    }
    .padding(20)
    .background(Color.white)
    .cornerRadius(12)
    .transition(.move(edge: .bottom).combined(with: .opacity))
}
.animation(.easeInOut(duration: 0.3), value: viewModel.showDetail)
```

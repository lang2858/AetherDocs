# 展示组件参考

AE 展示组件用于呈现文本、图片、图标等可见内容。所有展示组件均支持 `_style` 全局样式属性。

---

## Text

文本展示组件，支持丰富的排版属性。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | str | 必填 | 文本内容 |
| size | num | — | 字号 |
| weight | enum | normal | 字重：`thin` / `light` / `regular` / `normal` / `medium` / `semibold` / `bold` |
| color | str | — | 文字颜色 |
| maxLines | num | — | 最大行数限制 |
| overflow | enum | wrap | 溢出处理：`clip`（裁剪）/ `ellipsis`（省略号）/ `wrap`（换行） |
| align | enum | start | 对齐方式：`start` / `center` / `end` / `justify` |
| numberFormat | enum | — | 数字格式化：`none` / `decimal` / `percent` / `scientific` / `currency` |
| decimalPlaces | num | — | 小数位数 |
| prefix | str | — | 前缀文本 |
| suffix | str | — | 后缀文本 |
| autoScale | bool | — | 是否自动缩放适配 |
| minScale | num | — | 最小缩放比例 |
| font | str | — | 自定义字体名称 |

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击文本时触发 |

### 示例

**基本用法（内联属性）：**

```ae
Text("Hello" size=14 color="#FFF" weight="bold")
```

```swift
Text("Hello").font(.system(size: 14, weight: .bold)).foregroundColor(Color(hex: "#FFF"))
```

**点修饰符用法：**

```ae
Text("Hello").size(14).color("#FFF").bold()
```

```swift
Text("Hello").font(.system(size: 14)).foregroundColor(Color(hex: "#FFF")).bold()
```

**主题颜色：**

```ae
Text("标题" size=20 weight="bold").color($colors.text)
```

```swift
Text("标题").font(.system(size: 20, weight: .bold)).foregroundColor(AppColors.text)
```

**状态绑定 + 数字格式化：**

```ae
Text({Stats.count} size=36 weight="bold" numberFormat="decimal" decimalPlaces=1 suffix="万")
```

```swift
Text(viewModel.logic.getCount().formatted(.number.precision(.fractionLength(1))) + "万")
    .font(.system(size: 36, weight: .bold))
```

**行数限制 + 省略号：**

```ae
Text("很长的文本内容..." size=14 maxLines=2 overflow="ellipsis")
```

```swift
Text("很长的文本内容...")
    .font(.system(size: 14))
    .lineLimit(2)
    .truncationMode(.tail)
```

**自动缩放：**

```ae
Text("自适应文本" size=16 autoScale=true minScale=0.6)
```

```swift
Text("自适应文本")
    .font(.system(size: 16))
    .minimumScaleFactor(0.6)
```

---

## Image

图片展示组件，用于显示项目资源中的图片。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | str | 必填 | 图片资源路径，使用 `$assets.xxx` 引用 |
| mode | enum | contain | 缩放模式：`contain` / `cover` / `stretch` / `center` / `fill` |
| tintColor | str | — | 着色颜色，将图片渲染为单色模板 |

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击图片时触发 |

### 示例

**基本用法：**

```ae
Image($assets.logo).w(32).h(32)
```

```swift
Image("logo").frame(width: 32, height: 32)
```

**缩放模式：**

```ae
Image($assets.banner).w(200).h(120).mode("cover").radius(8)
```

```swift
Image("banner")
    .frame(width: 200, height: 120)
    .clipped()
    .aspectRatio(contentMode: .fill)
    .cornerRadius(8)
```

**着色：**

```ae
Image($assets.icon).w(20).h(20).tintColor("#5C9AE6")
```

```swift
Image("icon")
    .renderingMode(.template)
    .foregroundColor(Color(hex: "#5C9AE6"))
    .frame(width: 20, height: 20)
```

**动态资源：**

```ae
Image($assets.{icon}).w(24).h(24)
```

```swift
Image(icon).frame(width: 24, height: 24)
```

---

## Icon

系统图标组件，使用 SF Symbol 名称渲染。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | str | 必填 | SF Symbol 名称，如 `"star.fill"`、`"folder.fill"` |
| size | num | 24 | 图标大小 |
| color | str | — | 图标颜色 |

### 事件

| 事件 | 说明 |
|------|------|
| onTap | 点击图标时触发 |

### 示例

**基本用法：**

```ae
Icon(name="folder.fill" size=12 color="#5C9AE6")
```

```swift
Image(systemName: "folder.fill")
    .font(.system(size: 12))
    .foregroundColor(Color(hex: "#5C9AE6"))
```

**主题颜色：**

```ae
Icon(name="star.fill" size=20 color=$colors.primary)
```

```swift
Image(systemName: "star.fill")
    .font(.system(size: 20))
    .foregroundColor(AppColors.primary)
```

---

## Rectangle

内置矩形形状组件，通过属性或点修饰符控制外观。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| w | num | — | 宽度（别名 `width`） |
| h | num | — | 高度（别名 `height`） |
| bg | str | — | 填充颜色（别名 `color`） |
| radius | num | — | 圆角半径 |

### 事件

无。

### 子组件

不支持。

### 示例

```ae
Rectangle().w(6).h(32).bg("#1E2333").radius(3)
```

```swift
Rectangle()
    .frame(width: 6, height: 32)
    .fill(Color(hex: "#1E2333"))
    .cornerRadius(3)
```

---

## Badge

徽标组件，用于显示状态标记。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | str | — | 徽标文本 |
| count | num | — | 徽标数字 |
| type | enum | number | 徽标类型：`dot`（圆点）/ `number`（数字）/ `text`（文本） |
| color | str | — | 徽标颜色 |

### 事件

无。

### 示例

```ae
HStack {
    Icon(name="bell.fill" size=20)
    Badge(count=5 type="number" color="#FF4D4F")
}
```

```swift
HStack {
    Image(systemName: "bell.fill").font(.system(size: 20))
    ZStack(alignment: .topTrailing) {
        Color.clear
        Text("5")
            .font(.system(size: 10, weight: .bold))
            .foregroundColor(.white)
            .padding(.horizontal, 4)
            .padding(.vertical, 2)
            .background(Color(hex: "#FF4D4F"))
            .clipShape(Capsule())
    }
}
```

圆点徽标：

```ae
Badge(type="dot" color="#FF4D4F")
```

---

## Avatar

头像组件，支持图片和文字回退。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | str | — | 头像图片资源路径 |
| name | str | — | 用于文字头像的名称（无图片时显示首字） |
| size | num | 40 | 头像尺寸 |

### 事件

无。

### 示例

**图片头像：**

```ae
Avatar(src=$assets.avatar size=48)
```

```swift
Image("avatar")
    .frame(width: 48, height: 48)
    .clipShape(Circle())
```

**文字头像：**

```ae
Avatar(name="张三" size=40)
```

```swift
Text("张")
    .font(.system(size: 16, weight: .medium))
    .foregroundColor(.white)
    .frame(width: 40, height: 40)
    .background(Color(hex: "#5C9AE6"))
    .clipShape(Circle())
```

---

## Tag

标签组件，用于分类标记或状态标注。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | str | 必填 | 标签文本 |
| type | enum | default | 标签类型：`default` / `primary` / `success` / `warning` / `error` |
| closable | bool | false | 是否可关闭 |

### 事件

| 事件 | 说明 |
|------|------|
| onClick | 点击标签时触发 |
| onClose | 关闭标签时触发（需 `closable=true`） |

### 示例

```ae
HStack(spacing=8) {
    Tag(text="默认" type="default")
    Tag(text="主要" type="primary")
    Tag(text="成功" type="success")
    Tag(text="警告" type="warning")
    Tag(text="错误" type="error" closable=true onClose={Home.remove_tag()})
}
```

```swift
HStack(spacing: 8) {
    Text("默认").font(.system(size: 12)).padding(.horizontal, 8).padding(.vertical, 4)
        .background(Color(hex: "#F2F3F5")).cornerRadius(4)
    Text("主要").font(.system(size: 12)).foregroundColor(.white).padding(.horizontal, 8).padding(.vertical, 4)
        .background(AppColors.primary).cornerRadius(4)
    Text("成功").font(.system(size: 12)).foregroundColor(Color(hex: "#00B42A")).padding(.horizontal, 8).padding(.vertical, 4)
        .background(Color(hex: "#E8FFEA")).cornerRadius(4)
    Text("警告").font(.system(size: 12)).foregroundColor(Color(hex: "#FF7D00")).padding(.horizontal, 8).padding(.vertical, 4)
        .background(Color(hex: "#FFF7E8")).cornerRadius(4)
    HStack(spacing: 4) {
        Text("错误").font(.system(size: 12)).foregroundColor(Color(hex: "#FF4D4F"))
        Button(action: { viewModel.logic.removeTag() }) {
            Image(systemName: "xmark").font(.system(size: 10))
        }
    }.padding(.horizontal, 8).padding(.vertical, 4)
    .background(Color(hex: "#FFECE8")).cornerRadius(4)
}
```

---

## Card

卡片容器组件，用于信息分组展示。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | str | — | 卡片标题 |
| subtitle | str | — | 卡片副标题 |
| elevation | num | 1 | 阴影层级 |

### 事件

| 事件 | 说明 |
|------|------|
| onClick | 点击卡片时触发 |
| onTap | 点击卡片时触发 |

### 子组件

支持任意子组件。

### 示例

```ae
Card(title="用户信息" subtitle="基本信息" elevation=2) {
    HStack(spacing=12) {
        Avatar(src=$assets.avatar size=48)
        VStack(spacing=4 align=start) {
            Text("张三" size=16 weight="bold")
            Text("产品设计师" size=13 color="#8A90A2")
        }
    }
    .pad(16)
}
```

```swift
VStack(alignment: .leading, spacing: 0) {
    VStack(alignment: .leading, spacing: 4) {
        Text("用户信息").font(.system(size: 16, weight: .bold))
        Text("基本信息").font(.system(size: 13)).foregroundColor(Color(hex: "#8A90A2"))
    }.padding(16)
    HStack(spacing: 12) {
        Image("avatar").frame(width: 48, height: 48).clipShape(Circle())
        VStack(alignment: .leading, spacing: 4) {
            Text("张三").font(.system(size: 16, weight: .bold))
            Text("产品设计师").font(.system(size: 13)).foregroundColor(Color(hex: "#8A90A2"))
        }
    }.padding(16)
}
.background(Color(hex: "#1E2333"))
.cornerRadius(8)
.shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
```

---

## Section

内容分区组件，支持可折叠。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | str | — | 分区标题 |
| subtitle | str | — | 分区副标题 |
| collapsible | bool | false | 是否可折叠 |

### 事件

无。

### 子组件

支持任意子组件。

### 示例

**基本分区：**

```ae
Section(title="基本设置") {
    Form {
        FormItem(label="用户名") {
            TextField(value={Settings.username} placeholder="请输入")
        }
    }
}
```

**可折叠分区：**

```ae
Section(title="高级设置" collapsible=true) {
    Form {
        FormItem(label="调试模式") {
            Toggle(value={Settings.debug})
        }
    }
}
```

```swift
VStack(alignment: .leading, spacing: 0) {
    HStack {
        Text("高级设置").font(.system(size: 16, weight: .bold))
        Spacer()
        Image(systemName: "chevron.down").font(.system(size: 14)).foregroundColor(Color(hex: "#8A90A2"))
    }.padding(16)
    if !collapsed {
        Form {
            // ...
        }
    }
}
.background(Color(hex: "#1E2333"))
.cornerRadius(8)
```

---

## RichText

富文本展示组件，支持 Markdown、HTML 和 Attributed String 格式。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | str | 必填 | 富文本内容 |
| format | enum | markdown | 格式：`markdown` / `html` / `attributed` |
| linkColor | str | — | 链接颜色 |
| detectLinks | bool | false | 是否自动检测链接 |
| detectMentions | bool | false | 是否自动检测 @提及 |

### 示例

```ae
RichText(content="**粗体** 和 *斜体*" format="markdown" linkColor=$colors.primary)
```

---

## RichEditor

富文本编辑器组件，支持格式化输入和工具栏。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | str | — | 编辑器内容绑定 |
| format | enum | markdown | 格式：`markdown` / `html` / `attributed` |
| placeholder | str | — | 占位提示文本 |
| readOnly | bool | false | 是否只读 |
| showToolbar | bool | false | 是否显示格式化工具栏 |
| autoFocus | bool | false | 是否自动聚焦 |
| maxHeight | num | — | 最大高度 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 内容变化时触发 |
| onFocus | 获取焦点时触发 |
| onBlur | 失去焦点时触发 |

### 示例

```ae
RichEditor(content={Note.body} format="markdown" placeholder="开始编写..." showToolbar=true onChange={Note.save()})
```

---

## AsyncImage

异步图片加载组件，支持占位图和着色。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | str | 必填 | 图片资源路径，使用 `$assets.xxx` 引用 |
| mode | enum | contain | 缩放模式：`contain` / `cover` / `stretch` / `center` |
| placeholder | str | — | 加载中占位图，使用 `$assets.xxx` 引用 |
| tintColor | str | — | 着色颜色 |

### 示例

```ae
AsyncImage(src=$assets.photo placeholder=$assets.placeholder).w(200).h(150).radius(8)
```

---

## Canvas

自定义绘制画布组件，通过 `onRender` 绑定 Rust 逻辑层的渲染函数，实现动态绘制。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| drawsContent | bool | false | 是否绘制内容 |
| dirtyRect | str | — | 脏区域矩形描述 |
| onRender | callback | — | 渲染回调，绑定返回 DisplayList JSON 的 Rust 方法 |

### 示例

**基本用法：**

```ae
Canvas(drawsContent=true).w(300).h(200)
```

**绑定 Rust 渲染函数：**

```ae
Canvas(onRender={Home.get_commands}).w(100%).h(400)
```

```swift
Canvas { context, size in
    let displayList = CanvasRenderer.shared.getDisplayList()
    for item in displayList {
        // 根据 DrawItem type 渲染 text/rect/path/circle/line
    }
}
.onAppear { CanvasRenderer.shared.render(viewModel.logic.getCommands()) }
```

### 渲染流程

1. `.ae` 中 `onRender={Home.get_commands}` 绑定 Rust 方法
2. Canvas `onAppear` 时调用 `CanvasRenderer.shared.render(viewModel.logic.getCommands())`
3. Rust `get_commands()` 返回 DisplayList JSON 字符串
4. `CanvasRenderer` 解析 JSON，SwiftUI Canvas 闭包遍历 DrawItem 逐项绘制

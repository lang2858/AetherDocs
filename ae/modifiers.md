# 修饰符参考

AE 修饰符以点语法链式调用，映射为 SwiftUI 的 View Modifier。本章提供完整的修饰符对照表。

---

## 布局修饰符

| AE 修饰符 | SwiftUI 映射 | 示例 |
|-----------|-------------|------|
| `.pad(N)` | `.padding(N)` | `.pad(12)` |
| `.pad(top=T bottom=B left=L right=R)` | `.padding(EdgeInsets(top: T, leading: L, bottom: B, trailing: R))` | `.pad(left=8, right=8, top=4, bottom=4)` |
| `.mar(N)` | `Group { ... }.padding(N)` (外层包裹) | `.mar(16)` |
| `.mar(top=T bottom=B left=L right=R)` | `Group { ... }.padding(EdgeInsets(...))` | `.mar(top=3, bottom=6, left=6, right=6)` |
| `.w(N)` | `.frame(width: N)` | `.w(200)` |
| `.w(infinity)` | `.frame(maxWidth: .infinity, alignment: .leading)` | `.w(infinity)` |
| `.w(auto)` | 不生成 `.frame()` | `.w(auto)` (覆盖全局 w 样式) |
| `.w(fit)` | `.fixedSize(horizontal: true, vertical: false)` | `.w(fit)` (内容自适应宽度，覆盖主题 infinity) |
| `.h(N)` | `.frame(height: N)` | `.h(48)` |
| `.h(infinity)` | `.frame(maxHeight: .infinity)` | `.h(infinity)` |
| `.h(auto)` | 不生成 `.frame()` | `.h(auto)` (覆盖全局 h 样式) |
| `.h(fit)` | `.fixedSize(horizontal: false, vertical: true)` | `.h(fit)` (内容自适应高度，覆盖主题 infinity) |
| `.flexGrow(1)` | `.frame(maxWidth: .infinity)` | `.flexGrow(1)` |

### 内边距示例

**统一内边距：**

```ae
VStack { ... }.pad(16)
```

```swift
VStack { ... }.padding(16)
```

**方向内边距：**

```ae
HStack { ... }.pad(left=8, right=8, top=4, bottom=4)
```

```swift
HStack { ... }.padding(EdgeInsets(top: 4, leading: 8, bottom: 4, trailing: 8))
```

### 宽高示例

```ae
Image($assets.logo).w(32).h(32)
```

```swift
Image("logo").frame(width: 32, height: 32)
```

### 弹性增长示例

```ae
ScrollView(.vertical) { ... }.flexGrow(1)
```

```swift
ScrollView(.vertical) { ... }.frame(maxWidth: .infinity)
```

### 外边距示例

**统一外边距：**

```ae
VStack { ... }.mar(8)
```

```swift
Group { VStack { ... } }.padding(8)
```

**方向外边距：**

```ae
HStack { ... }.mar(top=3, bottom=6, left=6, right=6)
```

```swift
Group { HStack { ... } }.padding(EdgeInsets(top: 3, leading: 6, bottom: 6, trailing: 6))
```

> `.mar()` 通过 `Group { ... }.padding(...)` 实现外边距，与 `.pad()`（内边距）的方向相反。

### auto 覆盖示例

当全局样式设置了 `w = "infinity"` 或 `h = "infinity"`，某些组件需要按内容自适应时，使用 `.w(auto)` 或 `.h(auto)` 覆盖：

```ae
// 全局: VStack 默认 w=infinity → 撑满宽度
VStack { ... }

// 覆盖: .w(auto) → 不生成 .frame(maxWidth: .infinity)
HStack { ... }.w(auto)
```

---

## 外观修饰符

| AE 修饰符 | SwiftUI 映射 | 示例 |
|-----------|-------------|------|
| `.bg("#hex")` | `.background(Color(hex: "#hex"))` | `.bg("#121622")` |
| `.bg($colors.token)` | `.background(AppColors.token)` | `.bg($colors.primary)` |
| `.bg($assets.xxx, "tile")` | `.background(ImagePaint(image: Image("xxx")))` | `.bg($assets.paper_lines, "tile")` |
| `.color("#hex")` | `.foregroundColor(Color(hex: "#hex"))` | `.color("#8A90A2")` |
| `.color($colors.token)` | `.foregroundColor(AppColors.token)` | `.color($colors.text)` |
| `.radius(N)` | `.cornerRadius(N)` | `.radius(8)` |
| `.op(N)` | `.opacity(N)` | `.op(0.5)` |
| `.shadow(...)` | `.shadow(color:radius:x:y:)` | `.shadow(color="#000" radius=4 y=2)` |
| `.tintColor("#hex")` | `.foregroundColor(Color(hex: "#hex"))` (renderingMode: .template) | `.tintColor("#5C9AE6")` |
| `.tintColor($colors.token)` | `.foregroundColor(AppColors.token)` (renderingMode: .template) | `.tintColor($colors.primary)` |
| `.mode("contain")` | `.aspectRatio(contentMode: .fit)` | `.mode("contain")` |
| `.mode("cover")` | `.aspectRatio(contentMode: .fill)` | `.mode("cover")` |
| `.rotation(N)` | `.rotationEffect(.degrees(N))` | `.rotation(0.8)` |
| `.font("Name:size")` | `.font(.custom("Name", size: N))` | `.font("RYYCSXT:18")` |

### 背景色示例

```ae
VStack { ... }.bg("#121622")
```

```swift
VStack { ... }.background(Color(hex: "#121622"))
```

**主题颜色背景：**

```ae
Button("提交").bg($colors.primary)
```

```swift
Button(action: { viewModel.submit() }) { Text("提交") }.fixedSize().background(AppColors.primary)
```

### 前景色示例

```ae
Text("提示").size(13).color("#8A90A2")
```

```swift
Text("提示").font(.system(size: 13)).foregroundColor(Color(hex: "#8A90A2"))
```

### 圆角示例

```ae
VStack { ... }.bg("#1E2333").radius(12)
```

```swift
VStack { ... }.background(Color(hex: "#1E2333")).cornerRadius(12)
```

### 透明度示例

```ae
Text("已禁用").op(0.4)
```

```swift
Text("已禁用").opacity(0.4)
```

### 平铺背景示例

使用 `.bg($assets.xxx, "tile")` 可以平铺图片作为背景，常用于纸张纹理、图案等：

```ae
ScrollView(.vertical) {
    VStack { ... }
}
.bg($assets.paper_lines, "tile")
```

```swift
ScrollView(.vertical, showsIndicators: true) {
    VStack { ... }
}
.background(ImagePaint(image: Image("paper_lines")))
```

### 旋转示例

```ae
VStack { ... }.rotation(0.8)
```

```swift
VStack { ... }.rotationEffect(.degrees(0.8))
```

### 自定义字体示例

将字体文件放入 `src/assets/fonts/` 目录，框架会自动复制到 Xcode 项目并注册：

```ae
Text("手写笔记").font("RYYCSXT:18").color($colors.text)
```

```swift
Text("手写笔记").font(.custom("RYYCSXT", size: 18)).foregroundColor(AppColors.text)
```

---

## 边框修饰符

| AE 修饰符 | SwiftUI 映射 | 示例 |
|-----------|-------------|------|
| `.border(N)` | `.overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.gray.opacity(0.3), lineWidth: N))` | `.border(1)` |
| `.border(N, "#hex")` | `.overlay(RoundedRectangle(cornerRadius: 4).stroke(Color(hex: "#hex"), lineWidth: N))` | `.border(1, "#E5E6EB")` |
| `.border(N, $colors.token)` | `.overlay(RoundedRectangle(cornerRadius: 4).stroke(AppColors.token, lineWidth: N))` | `.border(1, $colors.divider)` |

### 示例

**默认边框：**

```ae
VStack { ... }.radius(8).border(1)
```

```swift
VStack { ... }
    .cornerRadius(8)
    .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color.gray.opacity(0.3), lineWidth: 1))
```

**自定义颜色边框：**

```ae
VStack { ... }.radius(8).border(1, "#E5E6EB")
```

```swift
VStack { ... }
    .cornerRadius(8)
    .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color(hex: "#E5E6EB"), lineWidth: 1))
```

**主题颜色边框：**

```ae
VStack { ... }.radius(8).border(1, $colors.divider)
```

```swift
VStack { ... }
    .cornerRadius(8)
    .overlay(RoundedRectangle(cornerRadius: 4).stroke(AppColors.divider, lineWidth: 1))
```

---

## 文字修饰符

| AE 修饰符 | SwiftUI 映射 | 说明 |
|-----------|-------------|------|
| `.size(N)` | `.font(.system(size: N))` | 设置字号 |
| `.bold()` | `.bold()` | 加粗（仅 Text 有效） |
| `.semibold()` | `.fontWeight(.semibold)` | 半粗 |
| `.medium()` | `.fontWeight(.medium)` | 中等 |
| `.light()` | `.fontWeight(.light)` | 细体 |
| `.thin()` | `.fontWeight(.thin)` | 极细 |
| `.italic()` | `.italic()` | 斜体（仅 Text 有效） |
| `.color(color)` | `.foregroundColor(...)` | 设置文字颜色 |

### 示例

```ae
Text("标题").size(20).bold().color($colors.text)
```

```swift
Text("标题").font(.system(size: 20)).bold().foregroundColor(AppColors.text)
```

---

## Text 内联属性

Text 组件支持在括号内直接使用属性，无需点修饰符：

| 内联属性 | 类型 | 说明 | 示例 |
|---------|------|------|------|
| `size` | num | 字号 | `Text("Hello" size=14)` |
| `weight` | enum | 字重 | `Text("Hello" weight="bold")` |
| `color` | str | 文字颜色 | `Text("Hello" color="#FFF")` |
| `numberFormat` | str | 数字格式化模式 | `Text({Val} numberFormat="decimal")` |
| `decimalPlaces` | num | 小数位数 | `Text({Val} decimalPlaces=2)` |
| `prefix` | str | 前缀文本 | `Text({Val} prefix="$")` |
| `suffix` | str | 后缀文本 | `Text({Val} suffix="万")` |
| `autoScale` | bool | 自动缩放适配 | `Text("长文本" autoScale=true)` |
| `minScale` | num | 最小缩放比例 | `Text("长文本" minScale=0.6)` |
| `font` | str | 自定义字体 | `Text("特殊字体" font="PingFangSC")` |

### 综合示例

```ae
Text({Stats.amount} size=24 weight="bold" color=$colors.primary
    numberFormat="decimal" decimalPlaces=2 prefix="¥")
```

```swift
Text("¥" + viewModel.logic.getAmount().formatted(.number.precision(.fractionLength(2))))
    .font(.system(size: 24, weight: .bold))
    .foregroundColor(AppColors.primary)
```

---

## Button 特殊属性

Button 组件支持以下特殊属性（通过点修饰符设置）：

| 属性 | 类型 | 说明 |
|------|------|------|
| `selected` | bool 绑定 | 选中状态绑定，如 `selected={Home.is_active()}` |
| `selectedStyle` | enum | 选中样式：`highlight`（背景高亮）/ `outline`（描边）/ `invert`（反色） |
| `pressedStyle` | enum | 按压样式：`scale`（缩放）/ `opacity`（透明度）/ `fade`（渐变）/ `none`（无效果） |
| `iconSize` | num | 图标大小 |
| `iconSpacing` | num | 图标与文字间距 |

### 选中状态示例

```ae
Button("关注" onClick={Home.toggle_follow()}
    selected={Home.is_following()}
    selectedStyle="invert")
```

```swift
Button(action: { viewModel.toggleFollow() }) {
    Text("关注")
}.fixedSize()
.background(viewModel.logic.getIsFollowing() ? Color.accentColor : Color.clear)
.foregroundColor(viewModel.logic.getIsFollowing() ? Color.white : Color.primary)
```

### 按压效果示例

```ae
Button("提交" onClick={Form.submit()} pressedStyle="scale")
```

```swift
Button(action: { viewModel.submit() }) {
    Text("提交")
}.fixedSize()
.buttonStyle(ScaleButtonStyle())
```

### 图标按钮示例

```ae
Button($assets.icon_add "新建" onClick={Home.create()})
    .iconSize(16)
    .iconSpacing(4)
```

```swift
Button(action: { viewModel.create() }) {
    HStack(spacing: 4) {
        AppAssets.icon_add.frame(width: 16).frame(height: 16)
        Text("新建")
    }
}.fixedSize()
```

---

## 交互修饰符

| AE 修饰符 | SwiftUI 映射 | 说明 |
|-----------|-------------|------|
| `.click(action=method)` | `.onTapGesture { editorManager.method() }` | 点击触发动作 |
| `.click(action=TypeName.method)` | 路由到对应目标（见下方详细说明） | 点击触发带类型前缀的动作 |

### .click() 修饰符

`.click()` 为任意视图添加点击手势，生成 SwiftUI 的 `.onTapGesture`。支持三种路由语法：

| AE 语法 | 条件 | 生成的 Swift 代码 | 说明 |
|---------|------|-------------------|------|
| `.click(action=setActiveFile)` | 无类型前缀 | `editorManager.setActiveFile()` | 路由到当前页面默认 Manager |
| `.click(action=Editor.setActiveFile)` | `Editor` 有 StateManager | `editorManager.setActiveFile()` | 路由到 StateManager |
| `.click(action=Home.on_click)` | `Home` 无 StateManager | `viewModel.logic.onClick()` | 路由到 Logic 层方法 |

**无类型前缀**时，`click` 路由到页面默认的 `editorManager`（向后兼容行为）。**带类型前缀**时，若该类型有 StateManager（如 `EditorStateManager`），则路由到对应 Manager 变量；否则路由到 ViewModel 的 Logic 层。

### 基本示例

```ae
Text("删除").click(action=delete_item)
```

```swift
Text("删除").onTapGesture { editorManager.deleteItem() }
```

### StateManager 路由示例

```ae
// Editor 类型有 EditorStateManager
Text("打开文件").click(action=Editor.open_file)
```

```swift
Text("打开文件").onTapGesture { editorManager.openFile() }
```

### Logic 层路由示例

```ae
// Home 类型无 StateManager，路由到 Logic 层
Button("刷新").click(action=Home.refresh_data)
```

```swift
Button(action: { viewModel.logic.refreshData() }) { Text("刷新") }.fixedSize()
```

---

## _style 全局样式属性

所有组件均支持以下全局样式属性，可通过点修饰符统一设置：

| 属性 | 修饰符 | 类型 | 说明 |
|------|--------|------|------|
| 宽度 | `.w(N)` | num | 设置组件宽度 |
| 高度 | `.h(N)` | num | 设置组件高度 |
| 背景色 | `.bg(color)` | str / $colors | 设置背景颜色 |
| 内边距 | `.pad(N)` / `.pad(...)` | num / 方向值 | 设置内边距 |
| 外边距 | `.mar(N)` / `.mar(...)` | num / 方向值 | 设置外边距 |
| 圆角 | `.radius(N)` | num | 设置圆角半径 |
| 透明度 | `.op(N)` | num (0-1) | 设置透明度 |
| 阴影 | `.shadow(...)` | 参数组合 | 设置阴影效果 |
| 边框 | `.border(N)` / `.border(N, color)` | num + 颜色 | 设置边框 |

### 方向参数

`.pad()` 和 `.mar()` 支持方向参数，可单独指定四个方向：

```ae
.pad(top=8 bottom=8 left=16 right=16)
```

```swift
.padding(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
```

也可简写部分方向（未指定的方向默认为 0）：

```ae
.pad(left=16 right=16)
```

```swift
.padding(.leading, 16).padding(.trailing, 16)
```

---

## 修饰符应用顺序

> **重要：** AE 源码中修饰符的书写顺序不影响最终生成结果。所有修饰符会按照固定的规范顺序输出到 SwiftUI 代码中。

AE 编译器将修饰符按以下固定顺序输出（从内到外包裹）：

| 顺序 | 修饰符 | 说明 |
|------|--------|------|
| 1 | `w` | 宽度 |
| 2 | `h` | 高度 |
| 3 | `padding` | 内边距 |
| 4 | `background` | 背景色 |
| 5 | `cornerRadius` | 圆角 |
| 6 | `border` | 边框 |
| 7 | `font` | 字体 |
| 8 | `font_weight` | 字重 |
| 9 | `font_italic` | 斜体 |
| 10 | `color` | 前景色 |
| 11 | `rotation` | 旋转 |
| 12 | `flexGrow` | 弹性增长 |
| 13 | `justify_frame` | 对齐帧 |

这意味着无论你如何书写修饰符，生成的 SwiftUI 代码始终遵循这个顺序。例如：

```ae
// 这两种写法生成相同的 SwiftUI 代码
HStack { ... }.border(1, $colors.divider).h(80).pad(left=6, right=6)
HStack { ... }.pad(left=6, right=6).h(80).border(1, $colors.divider)
```

```swift
// 两者都生成：
HStack { ... }.padding(EdgeInsets(top: 0, leading: 6, bottom: 0, trailing: 6)).frame(height: 80).overlay(RoundedRectangle(cornerRadius: 4).stroke(AppColors.divider, lineWidth: 1))
```

### 顺序对视觉效果的影响

由于修饰符从内到外包裹，顺序决定了各层之间的关系：

- **`w`/`h` → `bg`**：frame 在 background 内部，background 能撑满指定的高度/宽度
- **`w`/`h` → `border`**：frame 在 border 内部，border 能撑满指定的高度/宽度
- **`pad` → `bg`**：padding 在 background 内部，background 不包含 padding 区域
- **`bg` → `radius`**：背景色先应用，圆角裁剪背景

如果需要 border 包含 padding 区域的效果，应使用 `.mar()`（外边距）代替 `.pad()`（内边距），或直接在 border 后手动调整间距

---

## 综合示例

以下示例展示修饰符的组合使用：

```ae
VStack(spacing=12 align=start) {
    // 标题区域
    HStack {
        Text("数据概览" size=20 weight="bold").color($colors.text)
        Spacer()
        Icon(name="chart.bar.fill" size=18 color=$colors.secondary)
    }
    .pad(bottom=8)
    .border(bottom=1, $colors.divider)

    // 数据卡片
    HStack(spacing=12) {
        VStack(spacing=4 align=center) {
            Text({Stats.total} size=28 weight="bold" color=$colors.primary)
                .numberFormat("decimal")
            Text("总量" size=12 color=$colors.secondary)
        }
        .flexGrow(1)
        .pad(16)
        .bg($colors.surface)
        .radius(12)
        .border(1, $colors.divider)

        VStack(spacing=4 align=center) {
            Text({Stats.active} size=28 weight="bold" color="#00B42A")
            Text("活跃" size=12 color=$colors.secondary)
        }
        .flexGrow(1)
        .pad(16)
        .bg($colors.surface)
        .radius(12)
    }
}
.pad(16)
.bg($colors.background)
```

```swift
VStack(alignment: .leading, spacing: 12) {
    HStack {
        Text("数据概览").font(.system(size: 20, weight: .bold)).foregroundColor(AppColors.text)
        Spacer()
        Image(systemName: "chart.bar.fill").font(.system(size: 18)).foregroundColor(AppColors.secondary)
    }
    .padding(.bottom, 8)
    .overlay(Rectangle().frame(height: 1).foregroundColor(AppColors.divider), alignment: .bottom)

    HStack(spacing: 12) {
        VStack(alignment: .center, spacing: 4) {
            Text(viewModel.logic.getTotal().formatted(.number))
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(AppColors.primary)
            Text("总量").font(.system(size: 12)).foregroundColor(AppColors.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(AppColors.surface)
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(AppColors.divider, lineWidth: 1))

        VStack(alignment: .center, spacing: 4) {
            Text(viewModel.logic.getActive())
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(Color(hex: "#00B42A"))
            Text("活跃").font(.system(size: 12)).foregroundColor(AppColors.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(AppColors.surface)
        .cornerRadius(12)
    }
}
.padding(16)
.background(AppColors.background)
```
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
| `.w(infinity)` | `.frame(maxWidth: .infinity)` | `.w(infinity)` |
| `.w(auto)` | 不生成 `.frame()` | `.w(auto)` (覆盖全局 w 样式) |
| `.h(N)` | `.frame(height: N)` | `.h(48)` |
| `.h(infinity)` | `.frame(maxHeight: .infinity)` | `.h(infinity)` |
| `.h(auto)` | 不生成 `.frame()` | `.h(auto)` (覆盖全局 h 样式) |
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
| `.color("#hex")` | `.foregroundColor(Color(hex: "#hex"))` | `.color("#8A90A2")` |
| `.color($colors.token)` | `.foregroundColor(AppColors.token)` | `.color($colors.text)` |
| `.radius(N)` | `.cornerRadius(N)` | `.radius(8)` |
| `.op(N)` | `.opacity(N)` | `.op(0.5)` |
| `.shadow(...)` | `.shadow(color:radius:x:y:)` | `.shadow(color="#000" radius=4 y=2)` |

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

## 修饰符链式调用顺序

修饰符按书写顺序从左到右依次应用，顺序影响最终效果。例如背景色和圆角的顺序：

```ae
// 推荐：先设背景再设圆角
VStack { ... }.bg("#1E2333").radius(12)

// 不推荐：圆角在背景之前可能裁剪异常
VStack { ... }.radius(12).bg("#1E2333")
```

```swift
// 推荐
VStack { ... }.background(Color(hex: "#1E2333")).cornerRadius(12)

// 不推荐
VStack { ... }.cornerRadius(12).background(Color(hex: "#1E2333"))
```

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
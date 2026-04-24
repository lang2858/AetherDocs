# 输入组件参考

AE 输入组件用于接收用户交互和数据输入。所有输入组件均支持 `_style` 全局样式属性。

---

## Button

按钮组件，支持文字按钮、图标按钮及文字图标组合按钮。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | str | 必填 | 按钮文字 |
| icon | str | — | 按钮图标，使用 `$assets.xxx` 引用 |
| disabled | bool | false | 是否禁用 |
| loading | bool | false | 是否加载中 |
| type | enum | primary | 按钮类型：`primary` / `secondary` / `outline` / `text` |

### 特殊属性

| 属性 | 类型 | 说明 |
|------|------|------|
| selected | bool | 选中状态绑定，如 `selected={Home.is_active()}` |
| selectedStyle | enum | 选中样式：`highlight`（背景高亮）/ `outline`（描边）/ `invert`（反色） |
| pressedStyle | enum | 按压样式：`scale`（缩放）/ `opacity`（透明度）/ `fade`（渐变）/ `none`（无效果） |
| iconSize | num | 图标大小 |
| iconSpacing | num | 图标与文字间距，默认 4 |

### 事件

| 事件 | 说明 |
|------|------|
| onClick | 点击按钮时触发 |

### 示例

**文字按钮：**

```ae
Button("Click me" onClick={Home.on_click()})
```

```swift
Button(action: { viewModel.onClick() }) {
    Text("Click me")
}.fixedSize()
```

**带图标按钮：**

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

**选中状态按钮：**

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

**按压效果：**

```ae
Button("提交" onClick={Home.submit()} pressedStyle="opacity")
```

```swift
Button(action: { viewModel.submit() }) {
    Text("提交")
}.fixedSize()
.buttonStyle(OpacityButtonStyle())
```

---

## IconButton

纯图标按钮组件，用于工具栏、导航栏等场景。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | str | 必填 | 图标名称 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onClick | 点击按钮时触发 |

### 示例

```ae
IconButton(icon="xmark" onClick={Home.close()})
```

```swift
Button(action: { viewModel.close() }) {
    Image(systemName: "xmark")
}.fixedSize()
```

---

## TextField

单行文本输入组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 输入值绑定 |
| placeholder | str | — | 占位提示文本 |
| label | str | — | 输入框标签 |
| error | str | — | 错误提示信息 |
| disabled | bool | false | 是否禁用 |
| readonly | bool | false | 是否只读 |
| maxLength | num | — | 最大输入长度 |
| keyboardType | enum | default | 键盘类型：`default` / `number` / `email` / `phone` / `password` |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 内容变化时触发 |
| onFocus | 获取焦点时触发 |
| onBlur | 失去焦点时触发 |
| onSubmit | 提交时触发（回车键） |

### 示例

**基本输入框：**

```ae
TextField(value={Login.username} placeholder="请输入用户名" label="用户名")
```

**带验证的输入框：**

```ae
TextField(value={Form.email} placeholder="请输入邮箱"
    label="邮箱" error={Form.email_error}
    keyboardType="email")
```

**密码输入框：**

```ae
TextField(value={Login.password} placeholder="请输入密码"
    keyboardType="password")
```

---

## TextArea

多行文本输入组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 输入值绑定 |
| placeholder | str | — | 占位提示文本 |
| label | str | — | 输入框标签 |
| rows | num | 3 | 默认可见行数 |
| maxLength | num | — | 最大输入长度 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 内容变化时触发 |
| onFocus | 获取焦点时触发 |
| onBlur | 失去焦点时触发 |

### 示例

```ae
TextArea(value={Feedback.content} placeholder="请输入反馈内容" rows=4 label="反馈")
```

---

## Toggle

开关切换组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | bool | 必填 | 开关状态绑定 |
| label | str | — | 开关标签文字 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 状态变化时触发 |

### 示例

```ae
Toggle(value={Settings.dark_mode} label="深色模式" onChange={Settings.toggle_dark()})
```

```swift
Toggle(isOn: Binding(
    get: { viewModel.logic.getDarkMode() },
    set: { _ in viewModel.toggleDark() }
)) {
    Text("深色模式")
}
```

---

## Checkbox

复选框组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| checked | bool | 必填 | 是否选中 |
| label | str | — | 复选框标签文字 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 选中状态变化时触发 |

### 示例

```ae
Checkbox(checked={Form.agree_terms} label="我同意用户协议" onChange={Form.toggle_agree()})
```

---

## Radio

单选按钮组件，需配合 `group` 属性实现分组。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 当前选项的值 |
| group | str | 必填 | 分组名称 |
| label | str | — | 选项标签文字 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 选中状态变化时触发 |

### 示例

```ae
VStack(spacing=8) {
    Radio(value="small" group="size" label="小号" onChange={Order.set_size()})
    Radio(value="medium" group="size" label="中号" onChange={Order.set_size()})
    Radio(value="large" group="size" label="大号" onChange={Order.set_size()})
}
```

---

## RadioGroup

单选按钮组组件，简化一组 Radio 的使用。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 当前选中的值 |
| options | str | — | 选项值列表 |
| direction | enum | vertical | 排列方向：`vertical` / `horizontal` |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 选中项变化时触发 |

### 示例

```ae
RadioGroup(value={Settings.theme} options=["light","dark","auto"]
    direction="horizontal" onChange={Settings.set_theme()})
```

---

## Slider

滑块组件，用于连续值的选择。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | num | 必填 | 当前值绑定 |
| min | num | 0 | 最小值 |
| max | num | 100 | 最大值 |
| step | num | 1 | 步进值 |
| disabled | bool | false | 是否禁用 |
| showValue | bool | false | 是否显示当前值 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 值变化时触发 |

### 示例

```ae
Slider(value={Player.volume} min=0 max=100 step=1 showValue=true onChange={Player.set_volume()})
```

```swift
Slider(value: Binding(
    get: { Double(viewModel.logic.getVolume()) },
    set: { viewModel.setVolume(String(Int($0))) }
), in: 0...100, step: 1) {
    Text("音量")
}
```

---

## Select

下拉选择组件，映射为 SwiftUI 的 `Menu`。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 当前选中的值 |
| options | str | — | 选项值列表，格式 `["a","b"]` |
| labels | str | — | 选项显示文本，格式 `["选项A","选项B"]` |
| placeholder | str | — | 占位提示文本 |
| label | str | — | 选择器标签 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 选中项变化时触发 |

### 示例

**基本下拉选择：**

```ae
Select(value="light" options=["light","dark"] onChange={Home.set_theme()})
```

```swift
Menu {
    Button { viewModel.setTheme("light") } label: { Text("light") }
    Button { viewModel.setTheme("dark") } label: { Text("dark") }
} label: {
    Text("light").font(.system(size: 11)).foregroundColor(Color.primary)
}.frame(width: 72).menuStyle(.borderlessButton)
```

**带显示标签和占位文本：**

```ae
Select(value={Settings.lang}
    options=["zh","en","ja"]
    labels=[@i18n.settings.zh,@i18n.settings.en,@i18n.settings.ja]
    placeholder="选择语言"
    onChange={Settings.set_lang()})
```

```swift
Menu {
    Button { viewModel.setLang("zh") } label: { Text(I18nManager.shared.tr("settings.zh")) }
    Button { viewModel.setLang("en") } label: { Text(I18nManager.shared.tr("settings.en")) }
    Button { viewModel.setLang("ja") } label: { Text(I18nManager.shared.tr("settings.ja")) }
} label: {
    Text("选择语言").font(.system(size: 11)).foregroundColor(Color.primary)
}.frame(width: 72).menuStyle(.borderlessButton)
```

**自定义样式：**

```ae
Select(value={Settings.theme} options=["light","dark"]
    placeholder="主题"
    color=$colors.text
    bg=$colors.surface
    radius=6
    border=1,$colors.divider
    onChange={Settings.set_theme()})
```

```swift
Menu {
    Button { viewModel.setTheme("light") } label: { Text("light") }
    Button { viewModel.setTheme("dark") } label: { Text("dark") }
} label: {
    Text("主题")
        .font(.system(size: 11))
        .foregroundColor(AppColors.text)
        .background(AppColors.surface)
        .padding(.horizontal, 8)
        .cornerRadius(6)
}.frame(width: 72)
.overlay(RoundedRectangle(cornerRadius: 6).stroke(AppColors.divider, lineWidth: 1))
.menuStyle(.borderlessButton)
```

---

## DatePicker

日期时间选择组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 日期值绑定 |
| label | str | — | 选择器标签 |
| mode | enum | date | 选择模式：`date` / `time` / `datetime` |
| minDate | str | — | 最小可选日期 |
| maxDate | str | — | 最大可选日期 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 日期变化时触发 |

### 示例

```ae
DatePicker(value={Form.birth_date} label="出生日期" mode="date" onChange={Form.set_birth_date()})
```

```swift
DatePicker("出生日期", selection: Binding(
    get: { viewModel.logic.getBirthDate() },
    set: { _ in viewModel.setBirthDate() }
), displayedComponents: .date)
```

---

## SearchBar

搜索栏组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 搜索文本绑定 |
| placeholder | str | — | 占位提示文本 |
| showCancel | bool | false | 是否显示取消按钮 |

### 事件

| 事件 | 说明 |
|------|------|
| onSubmit | 搜索提交时触发 |
| onCancel | 取消搜索时触发 |
| onChange | 搜索文本变化时触发 |

### 示例

```ae
SearchBar(value={Home.search_text} placeholder="搜索内容" showCancel=true onSubmit={Home.search()} onCancel={Home.clear_search()})
```

```swift
HStack {
    TextField("搜索内容", text: Binding(
        get: { viewModel.logic.getSearchText() },
        set: { viewModel.setSearchText($0) }
    ))
    .textFieldStyle(.roundedBorder)
    if showCancel {
        Button("取消") { viewModel.clearSearch() }
    }
}
.onSubmit { viewModel.search() }
```

---

## Rate

评分组件。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | num | 必填 | 当前评分值绑定 |
| count | num | 5 | 星星总数 |
| allowHalf | bool | false | 是否允许半星 |
| readonly | bool | false | 是否只读 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 评分变化时触发 |

### 示例

```ae
Rate(value={Review.score} count=5 allowHalf=true onChange={Review.set_score()})
```

```swift
HStack(spacing: 4) {
    ForEach(0..<5, id: \.self) { index in
        Image(systemName: index < Int(viewModel.logic.getScore()) ? "star.fill" : "star")
            .foregroundColor(AppColors.primary)
    }
}
```

---

## Form

表单容器组件，为内部 `FormItem` 提统一致的布局。

### 属性

无专用属性。

### 事件

无。

### 子组件

支持任意子组件（通常包含 `FormItem`）。

### 示例

```ae
Form {
    FormItem(label="用户名" required=true) {
        TextField(value={Form.username} placeholder="请输入")
    }
    FormItem(label="邮箱") {
        TextField(value={Form.email} placeholder="请输入" keyboardType="email")
    }
}
```

---

## FormItem

表单项组件，用于为输入控件添加标签、必填标记、错误提示等。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | str | 必填 | 字段标签 |
| required | bool | false | 是否必填（显示必填标记） |
| error | str | — | 错误提示信息 |
| help | str | — | 帮助提示信息 |

### 事件

无。

### 子组件

支持单个输入组件作为子组件。

### 示例

**必填字段：**

```ae
FormItem(label="用户名" required=true error={Form.username_error}) {
    TextField(value={Form.username} placeholder="3-20个字符")
}
```

**带帮助提示：**

```ae
FormItem(label="密码" required=true help="至少8个字符") {
    TextField(value={Form.password} placeholder="请输入密码" keyboardType="password")
}
```

```swift
VStack(alignment: .leading, spacing: 4) {
    HStack(spacing: 4) {
        Text("密码").font(.system(size: 14, weight: .medium))
        Text("*").foregroundColor(Color.red)
    }
    SecureField("请输入密码", text: Binding(
        get: { viewModel.logic.getPassword() },
        set: { viewModel.setPassword($0) }
    ))
    Text("至少8个字符").font(.system(size: 12)).foregroundColor(Color(hex: "#8A90A2"))
}
```
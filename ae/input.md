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
| size | num | — | 按钮尺寸 |

### 特殊属性

| 属性 | 类型 | 说明 |
|------|------|------|
| selected | bool | 选中状态绑定，如 `selected={Home.is_active()}` |
| selectedStyle | enum | 选中样式：`highlight`（背景高亮）/ `outline`（描边）/ `invert`（反色） |
| pressedStyle | enum | 按压样式：`scale`（缩放）/ `opacity`（透明度）/ `fade`（渐变）/ `none`（无效果） |

#### pressedStyle 与 hover 行为

`pressedStyle` 同时影响按压和 hover 交互行为：

| pressedStyle 值 | 按压效果 | hover 效果 | 说明 |
|---|---|---|---|
| `scale` | 缩放至 0.95 | 显示 `AppColors.hover_bg` 背景叠加 | 默认值，最常用 |
| `opacity` | 降低透明度 | 显示 `AppColors.hover_bg` 背景叠加 | 适合文字按钮 |
| `fade` | 渐变淡出 | 显示 `AppColors.hover_bg` 背景叠加 | 适合次要操作 |
| `none` | 无效果 | 无效果 | 完全禁用交互反馈 |

> **注意**：hover 背景依赖主题 `[colors]` 中的 `hover_bg` 令牌。如果 `hover_bg` 未定义，所有 hover 效果静默失效。
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

### 特殊属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| pressedStyle | enum | scale | 按压样式：`scale` / `opacity` / `fade` / `none`，行为与 Button 相同 |
| size | num | — | 按钮尺寸 |
| iconSize | num | — | 图标大小 |
| color | str | — | 图标颜色 |
| fg | str | — | 前景色 |

IconButton 的 hover 效果通过 `HoverOverlayModifier` 实现，在所有修饰符（`.background()`、`.frame()` 等）之后叠加 `AppColors.hover_bg`。如果主题缺少 `hover_bg` 令牌，hover 效果静默失效。

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

## TextEditor

代码编辑器组件，支持 AE 语法高亮、行号显示和滚动同步。当 `syntax="ae"` 时，框架生成带语法高亮的原生代码编辑器视图（`AeTextView`），高亮规则从 `aether-lang` spec 数据自动注入。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 编辑内容绑定 |
| placeholder | str | — | 占位提示文本 |
| syntax | enum | — | 语法高亮模式：`ae`（AE DSL 语法高亮） |

### 语法高亮

当设置 `syntax="ae"` 时，TextEditor 从框架层生成原生代码编辑器，包含：

- **行号显示** — 左侧 gutter 区域，滚动同步
- **AE 关键词高亮** — `component`、`true`、`false`、`nil`（紫色）
- **组件名称** — `VStack`、`HStack`、`Button` 等内置组件（蓝色）
- **修饰符方法** — `.pad()`、`.bg()`、`.color()` 等点前缀修饰符（绿色）
- **属性名** — `spacing=`、`align=` 等键值属性（橙色）
- **枚举值** — `primary`、`vertical`、`bold` 等（浅紫色）
- **自定义组件调用** — `:MyComponent(...)` 前缀调用（蓝色）
- **状态绑定** — `{UpperIdent.ident}` 花括号引用（粉色）
- **主题引用** — `$colors.xxx`、`$spacing.xxx`、`$assets.xxx`（青色）
- **国际化引用** — `@i18n.section.key`（金色）
- **字符串** — `"..."`（浅绿色）
- **数字** — `12`、`0.5`（橙色）
- **注释** — `// ...`（灰色，最高优先级覆盖所有）

高亮规则从 `aether-lang` 的 `COMPONENT_SPECS` / `MODIFIER_SPECS` 自动提取，无需手写配置。

### 示例

**AE 语法编辑器：**

```ae
TextEditor(value={EditorState.active_content} syntax="ae").w(infinity).h(infinity)
```

生成 Swift：

```swift
AeTextView(
    text: $editorManager.activeContent,
    lineNumColor: NSColor(AppColors.text_secondary),
    syntaxRules: [HighlightRule(tokens: [...], pattern: "word", color: ...), ...]
)
.frame(maxWidth: .infinity, maxHeight: .infinity)
```

**普通文本编辑器（无高亮）：**

```ae
TextEditor(value={Notes.content} placeholder="输入笔记")
```

---

## PathField

路径选择输入组件，类似 HTML `<input type="file">`。由只读路径文本框和浏览按钮组成，点击浏览按钮弹出系统目录/文件选择器，选中路径自动回写到绑定的状态字段。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 路径值的状态绑定（双向） |
| placeholder | str | "选择路径..." | 未选择路径时的占位文本 |
| label | str | — | 标签文本 |
| pickerMode | enum | directory | 选择器模式：`directory` / `file` |
| onChange | callback | — | 路径变化时触发 |

### 示例

**基本用法（选择目录）：**

```ae
PathField(value={Welcome.new_project_dir} placeholder="选择保存位置...")
```

```swift
HStack {
    Text(welcomeManager.newProjectDir.isEmpty ? "选择保存位置..." : welcomeManager.newProjectDir)
        .foregroundColor(welcomeManager.newProjectDir.isEmpty ? .secondary : .primary)
        .lineLimit(1).truncationMode(.middle)
        .frame(maxWidth: .infinity, alignment: .leading)
    Button(action: { FilePickerManager.showDirectoryPicker { path in
        if let p = path { welcomeManager.setNewProjectDir(p) }
    }}) { Image(systemName: "folder").foregroundColor(.secondary) }.buttonStyle(.plain)
}.padding(8).background(Color.gray.opacity(0.1)).cornerRadius(8)
```

**选择文件：**

```ae
PathField(value={Settings.config_path} pickerMode="file" label="配置文件")
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
| options | any | — | 选项值列表，格式 `["a","b"]` |
| labels | any | — | 选项显示文本，格式 `["选项A","选项B"]` |
| placeholder | str | — | 占位提示文本 |
| label | str | — | 选择器标签 |
| disabled | bool | false | 是否禁用 |
| color | str | — | 文字颜色 |
| size | num | — | 字号 |
| bg | str | — | 背景颜色 |
| pad | padding | — | 内边距 |
| radius | num | — | 圆角半径 |
| border | border | — | 边框 |

### SelectOption

Select 的子选项组件，用于更灵活地定义选项（替代 `options`/`labels` 属性列表）。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 选项值 |
| label | str | — | 选项显示文本 |
| disabled | bool | false | 是否禁用 |

### 事件

| 事件 | 别名 | 说明 |
|------|------|------|
| onChange | on_change | 选中项变化时触发 |

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

---

## Stepper

步进器组件，用于数值增减操作。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | num | 0 | 当前值 |
| min | num | 0 | 最小值 |
| max | num | 100 | 最大值 |
| step | num | 1 | 步进值 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 值变化时触发 |

### 示例

```ae
Stepper(value={Order.quantity} min=1 max=99 step=1 onChange={Order.update()})
```

---

## Segment

分段选择器组件，用于少量选项的快速切换。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | 必填 | 当前选中的值 |
| options | any | — | 选项列表 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 选中项变化时触发 |

### 示例

```ae
Segment(value="week" options=["日","周","月"] onChange={Filter.set_period()})
```

---

## Calendar

日历选择组件，支持单选、多选和范围选择。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| selected | str | — | 选中日期 |
| mode | enum | single | 选择模式：`single` / `multiple` / `range` |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 选中日期变化时触发 |

### 示例

```ae
Calendar(mode="single" selected={Event.date} onChange={Event.setDate()})
```

---

## PinInput

验证码输入组件，用于 OTP/PIN 码场景。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | — | 输入值 |
| length | num | — | 输入位数 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 值变化时触发 |

### 示例

```ae
PinInput(length=6 value={Auth.code} onChange={Auth.verify()})
```

---

## SignaturePad

手写签名组件，用于合同签署等场景。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | str | — | 签名数据绑定 |

### 事件

| 事件 | 说明 |
|------|------|
| onChange | 签名变化时触发 |
| onClear | 清空签名时触发 |

### 示例

```ae
SignaturePad(value={Contract.signature} onClear={Contract.clear()})
```
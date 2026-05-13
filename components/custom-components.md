# 自定义组件 / Custom Components

Aether 支持自定义组件，允许开发者封装可复用的 UI 片段。组件在编译时内联展开，经过完整的 codegen 流程处理。

---

## 定义方式

### 1. 内联定义

在 `.ae` 文件中直接声明组件：

```ae
component ActionButton(icon: String, label: String, onClick: Action, color: String="$colors.text", width: Int=220)

Button(#label onClick=#onClick) {
    HStack(spacing=8) {
        Icon(name=#icon size=16 color=#color)
        Text(#label).size(14).color(#color)
    }
    .pad(left=12 right=16 top=8 bottom=8)
    .bg(opacity=0)
    .border(color=#color width=1 radius=8)
    .w(#width)
}
```

### 2. 独立文件定义

在 `src/ui/components/` 目录下创建 `.ae` 文件，文件名自动转换为 PascalCase 组件名：

| 文件路径 | 组件名 |
|---------|--------|
| `src/ui/components/action_button.ae` | `ActionButton` |
| `src/ui/components/partition_card.ae` | `PartitionCard` |
| `src/ui/components/nav_section.ae` | `NavSection` |
| `src/ui/components/gap_divider.ae` | `GapDivider` |
| `src/ui/components/select_field.ae` | `SelectField` |

---

## 无名组件

使用 `component()` 声明（无参数）时，文件名即为组件名：

```ae
// src/ui/components/project_navigator.ae
component() {
    VStack(spacing=0) {
        Text("PROJECT").size(11).color($colors.text_hint).semibold()
            .pad(left=16 top=8 bottom=4)
        FileTree(root="/src" onSelect={Home.on_file_select()} filter="*.swift")
    }
    .bg($colors.surface)
}
```

组件名 → `ProjectNavigator`（由文件名 `project_navigator.ae` 转换）。

---

## 参数定义

组件参数在 `component` 声明中定义，使用逗号分隔，支持类型注解和默认值：

```ae
component NavSection(icon: String, title: String, subtitle: String)
```

```ae
component NewProjectModal(visible: Bool, dismissible: Bool=true, onClose: Action)
```

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| icon | String | 是 | — | 图标名称，无默认值 |
| title | String | 是 | — | 文字，无默认值 |
| dismissible | Bool | 否 | true | 是否可关闭 |
| onClose | Action | 是 | — | 关闭回调，无默认值 |

### 参数类型

| 类型 | 说明 | Swift 映射 |
|------|------|-----------|
| `String` | 字符串（默认） | `String` |
| `Bool` | 布尔值 | `@Binding var name: Bool`（无默认值）<br>`let name: Bool`（有默认值） |
| `Int` | 整数 | `@Binding var name: Int`（无默认值）<br>`let name: Int`（有默认值） |
| `Double` | 浮点数 | `@Binding var name: Double`（无默认值）<br>`let name: Double`（有默认值） |
| `Action` | 回调闭包 | `let name: () -> Void` |

未标注类型的参数默认为 `String`。

### 默认值

使用 `=` 为参数指定默认值，调用时可省略有默认值的参数：

```ae
component Dialog(visible: Bool, dismissible: Bool=true, onClose: Action)
```

- `visible` — 无默认值，调用时必须传入绑定
- `dismissible` — 默认 `true`，可省略
- `onClose` — 无默认值，调用时必须传入闭包

---

## 参数引用

在组件 body 中使用 `#paramName` 引用参数值：

```ae
component NavSection(icon: String, title: String, subtitle: String)

HStack(spacing=12) {
    Icon(name=#icon size=12 color=$colors.text_secondary)
    Text(#title).size(11).bold().color($colors.text_secondary)
    Text(#subtitle).size(11).color($colors.text_secondary)
}
```

### 引用语法对照

| 语法 | 含义 | 示例 |
|------|------|------|
| `#paramName` | 组件参数引用 | `#title`、`#isActive`、`#onTap` |
| `$colors.xxx` | 主题颜色 token | `$colors.text`、`$colors.surface` |
| `{Type.field}` | 状态管理器绑定 | `{Welcome.show_new_project_form}` |

> **注意**：`#` 用于参数引用，`$` 用于主题 token 和状态绑定，不要混淆。

---

## 调用组件

使用 `:` 前缀加组件名的方式调用自定义组件，传入的参数覆盖默认值：

```ae
:nav_section(icon="folder" title="收藏")
```

`:` 前缀明确标识这是自定义组件调用，与内置布局控件（如 `VStack`、`Toolbar`）区分。内置控件不带前缀直接使用：

```ae
VStack(spacing=8) {           // 内置布局控件
    :nav_section(...)          // 自定义组件
}
Toolbar {                      // 内置 Toolbar 布局控件
    Icon(...)
    Spacer()
}
```

未传入的可选参数使用定义时的默认值：

```ae
// dismissible 使用默认值 true
:new_project_modal(visible={Welcome.show_new_project_form} onClose={Welcome.cancel_new_project()})
```

---

## 展开机制

自定义组件在编译时**内联展开**到调用位置，然后递归通过完整的 codegen 流程处理。展开后的代码行可以包含进一步的组件调用，形成递归展开链。

### 展开过程

```
1. 解析调用 → :nav_section(icon="folder" title="收藏")
2. 查找定义 → component NavSection(icon: String, title: String, subtitle: String) { ... }
3. 参数绑定 → icon="folder", title="收藏"
4. 替换引用 → #icon → "folder", #title → "收藏"
5. 内联展开 → 将替换后的 body 插入调用位置
6. 递归处理 → 展开后的代码继续经过 codegen 流程
```

### 示例

定义：

```ae
// src/ui/components/gap_divider.ae
component(gap: Int=8)

Spacer(h=#gap)
Divider()
Spacer(h=#gap)
```

调用：

```ae
VStack(spacing=0) {
    Text("标题").size(18).bold()
    :gap_divider(gap=16)
    Text("内容").size(14)
}
```

展开后：

```ae
VStack(spacing=0) {
    Text("标题").size(18).bold()
    Spacer(h=16)
    Divider()
    Spacer(h=16)
    Text("内容").size(14)
}
```

---

## 动态资源引用

参数值可以用于动态构建资源引用。使用 `$assets.#icon` 语法，其中 `#icon` 是参数名：

```ae
component ActionButton(icon: String, label: String, onClick: Action)

HStack(spacing=8) {
    Image(src=$assets.#icon).size(20)
    Text(#label).size(14)
}
.onTap(#onClick)
```

SwiftUI 输出：

```swift
HStack(spacing: 8) {
    Image(uiImage: AppAssets.plus)
        .resizable()
        .frame(width: 20, height: 20)
    Text("新建").font(.system(size: 14))
}
.onTapGesture { viewModel.onCreate() }
```

---

## 自定义组件与内置控件

自定义组件调用使用 `:` 前缀，内置布局控件不带前缀。两者同名时不会冲突：

```ae
Toolbar {             // 内置 Toolbar 布局控件（生成 .toolbar { ToolbarItemGroup { ... } })
    Icon(...)
}

:toolbar(icon="star") // 自定义组件（来自 src/ui/components/toolbar.ae）
```

| 类型 | 语法 | 示例 |
|------|------|------|
| 内置布局控件 | 名称直接使用 | `VStack { ... }`、`Toolbar { ... }` |
| 自定义组件 | `:` 前缀 | `:action_button(icon="plus")`、`:toolbar(icon="star")` |

---

## 完整项目示例

### AetherStudio 项目

```
src/ui/
├── routes.ae
├── drawers.ae
├── home.ae
├── welcome.ae
├── components/
│   ├── project_navigator.ae          → ProjectNavigator
│   ├── nav_section.ae                → NavSection
│   └── new_project.ae                → NewProjectModalContent
└── menu_drawer.ae
```

`nav_section.ae` — 带类型注解参数的导航区段：

```ae
component(icon: String, title: String, subtitle: String)

HStack() {
    Icon(name=#icon size=12 color=$colors.text_secondary)
    Text(#title).size(11).bold().color($colors.text_secondary)
    Text(#subtitle).size(11).color($colors.text_secondary)
    Spacer()
}
.h(24)
.pad(left=8)
.border(bottom=0.5 $colors.divider)
```

`welcome.ae` 中调用：

```ae
VStack(spacing=0) {
    :project_navigator()
    :nav_section(icon="star" title="收藏")
    :nav_section(icon="clock" title="最近")
}
.w(260)
.bg($colors.sidebar)
```

### 带布尔和 Action 参数的组件

```ae
// src/ui/components/new_project_modal_content.ae
component NewProjectModalContent()

VStack(spacing=20 alignX=center) {
    Text("New Project").size(22).bold().color($colors.text)
    // ... template selection, inputs, buttons
}
.w(360).pad(left=24 right=24 top=24 bottom=24).bg($colors.surface).radius(16)
```

在父页面中使用 Modal 包裹：

```ae
// welcome.ae
Modal(visible={Welcome.show_new_project_form} position=center dismissible=true onClose={Welcome.cancel_new_project()}) {
    :new_project()
}
```

Modal wrapper 保留在页面级，确保全屏覆盖；内容提取为组件，方便扩展。

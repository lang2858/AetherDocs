# 自定义组件 / Custom Components

Aether 支持自定义组件，允许开发者封装可复用的 UI 片段。组件在编译时内联展开，经过完整的 codegen 流程处理。

---

## 定义方式

### 1. 内联定义

在 `.ae` 文件中直接声明组件：

```ae
component ActionButton(icon, label, onClick, color="$colors.text", width=220) {
    Button(label onClick={onClick}) {
        HStack(spacing=8) {
            Icon(name=icon size=16 color=color)
            Text(label size=14 color=color)
        }
        .pad(left=12 right=16 top=8 bottom=8)
        .bg(opacity=0)
        .border(color=color width=1 radius=8)
        .w(width)
    }
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
        Text("PROJECT" size=11 color="$colors.text_hint" weight="semibold")
            .pad(left=16 top=8 bottom=4)
        FileTree(root="/src" onSelect={Home.on_file_select()} filter="*.swift")
    }
    .bg("$colors.surface")
}
```

组件名 → `ProjectNavigator`（由文件名 `project_navigator.ae` 转换）。

---

## 参数定义

参数以逗号分隔，可选参数使用 `=` 指定默认值：

```ae
component(icon, label, size=100, color="$colors.primary") {
    // body
}
```

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| icon | 是 | — | 图标名称，无默认值 |
| label | 是 | — | 文字，无默认值 |
| size | 否 | 100 | 尺寸，默认 100 |
| color | 否 | $colors.primary | 颜色，默认主题色 |

### 参数类型

参数类型均为字符串，codegen 时根据上下文推断实际类型：

- **数字**：`size=100` → Swift `CGFloat(100)`
- **颜色引用**：`color="$colors.primary"` → Swift `AppColors.primary`
- **资源引用**：`icon=$assets.gear` → Swift `AppAssets.gear`
- **回调**：`onClick={Home.on_tap()}` → Swift 闭包

---

## 组件体（Body）

花括号 `{ }` 之间的 AE 代码行构成组件体。使用 `{paramName}` 引用参数值：

```ae
component(icon, label, onClick, color="$colors.primary") {
    HStack(spacing=8) {
        Icon(name={icon} size=16 color={color})
        Text({label} size=14 color={color})
    }
    .pad(12)
    .bg(opacity=0)
    .border(color={color} width=1 radius=8)
    .onClick({onClick})
}
```

`{icon}`、`{label}` 等参数引用在展开时被实际传入值替换。

---

## 调用组件

使用组件名加属性的方式调用，传入的参数覆盖默认值：

```ae
ActionButton(icon="plus" label="Create" onClick={Home.on_create()})
```

未传入的可选参数使用定义时的默认值：

```ae
// color 使用默认值 "$colors.text"，width 使用默认值 220
ActionButton(icon="plus" label="Create" onClick={Home.on_create()})

// 覆盖 color 和 width
ActionButton(icon="trash" label="Delete" onClick={Home.on_delete()} color="$colors.error" width=180)
```

---

## 展开机制

自定义组件在编译时**内联展开**到调用位置，然后递归通过完整的 codegen 流程处理。展开后的代码行可以包含进一步的组件调用，形成递归展开链。

### 展开过程

```
1. 解析调用 → ActionButton(icon="plus" label="Create" onClick={Home.on_create()})
2. 查找定义 → component ActionButton(icon, label, onClick, color="$colors.text", width=220) { ... }
3. 参数绑定 → icon="plus", label="Create", onClick={Home.on_create()}, color="$colors.text", width=220
4. 替换引用 → {icon} → "plus", {label} → "Create", {onClick} → Home.on_create(), {color} → "$colors.text", {width} → 220
5. 内联展开 → 将替换后的 body 插入调用位置
6. 递归处理 → 展开后的代码继续经过 codegen 流程
```

### 示例

定义：

```ae
// src/ui/components/gap_divider.ae
component(gap=8) {
    Spacer(h=gap)
    Divider()
    Spacer(h=gap)
}
```

调用：

```ae
VStack(spacing=0) {
    Text("标题" size=18 weight="bold")
    GapDivider(gap=16)
    Text("内容" size=14)
}
```

展开后：

```ae
VStack(spacing=0) {
    Text("标题" size=18 weight="bold")
    Spacer(h=16)
    Divider()
    Spacer(h=16)
    Text("内容" size=14)
}
```

---

## 动态资源引用

参数值可以用于动态构建资源引用。使用 `$assets.{icon}` 语法，其中 `{icon}` 是参数名：

```ae
component(icon, label, onClick) {
    HStack(spacing=8) {
        Image(src=$assets.{icon} size=20)
        Text({label} size=14)
    }
    .onClick({onClick})
}
```

调用：

```ae
ActionButton(icon="plus" label="新建" onClick={Home.on_create()})
```

展开后 `{icon}` 被替换为 `"plus"`：

```ae
HStack(spacing=8) {
    Image(src=$assets.plus size=20)
    Text("新建" size=14)
}
.onClick(Home.on_create())
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

## 内置组件排除列表

以下名称是 Aether 内置组件，**不会**被识别为自定义组件：

| 内置组件 | | | | |
|---------|---|---|---|---|
| VStack | HStack | ZStack | Text | Button |
| Image | Icon | Rectangle | Select | Spacer |
| Divider | Grid | GridCell | ScrollView | Tab |
| Tabs | Stack | Routes | Drawer | Toast |
| Dialog | FileTree | | | |

如果 `src/ui/components/` 目录下存在与内置组件同名的文件（如 `text.ae`），该文件将被忽略，内置组件优先。

---

## 完整项目示例

### partition-manager 项目

```
src/ui/
├── routes.ae
├── home.ae
└── components/
    ├── action_button.ae    → ActionButton
    ├── partition_card.ae   → PartitionCard
    ├── gap_divider.ae      → GapDivider
    └── select_field.ae     → SelectField
```

`action_button.ae` — 通用操作按钮：

```ae
component(icon, label, onClick, color="$colors.text", width=220) {
    Button(label onClick={onClick}) {
        HStack(spacing=8) {
            Icon(name={icon} size=16 color={color})
            Text({label} size=14 color={color})
        }
        .pad(left=12 right=16 top=8 bottom=8)
        .bg(opacity=0)
        .border(color={color} width=1 radius=8)
        .w(width)
    }
}
```

`partition_card.ae` — 分区信息卡片：

```ae
component(name, size, type, used) {
    VStack(spacing=8) {
        HStack(space="between") {
            Text({name} size=16 weight="bold")
            Text({type} size=12 color="$colors.text_hint")
        }
        Progress(value={used} max=100 type="linear")
        Text({size} size=13 color="$colors.text_secondary")
    }
    .pad(16)
    .bg("$colors.surface")
    .radius(12)
    .shadow(size=2)
}
```

`home.ae` 中调用：

```ae
VStack(spacing=16) {
    Text("磁盘分区" size=20 weight="bold")
    GapDivider(gap=12)
    For(data=viewModel.partitions) {
        PartitionCard(name="{p.name}" size="{p.size}" type="{p.type}" used="{p.used_percent}")
    }
    HStack(spacing=12) {
        ActionButton(icon="plus" label="新建分区" onClick={Home.on_create()})
        ActionButton(icon="trash" label="删除" onClick={Home.on_delete()} color="$colors.error")
    }
}
.pad(20)
```

### AetherStudio 项目

```
src/ui/
├── routes.ae
├── drawers.ae
├── home.ae
├── components/
│   ├── project_navigator.ae  → ProjectNavigator
│   └── nav_section.ae        → NavSection
└── menu_drawer.ae
```

`project_navigator.ae` — 无名组件，文件名即组件名：

```ae
component() {
    VStack(spacing=0) {
        Text("PROJECT" size=11 color="$colors.text_hint" weight="semibold")
            .pad(left=16 top=8 bottom=4)
        FileTree(root="/src" onSelect={Home.on_file_select()} filter="*.swift")
    }
    .bg("$colors.surface")
}
```

`nav_section.ae` — 带参数的导航区段：

```ae
component(title, icon="folder") {
    VStack(spacing=4) {
        HStack(spacing=6) {
            Icon(name={icon} size=14 color="$colors.text_secondary")
            Text({title} size=12 color="$colors.text_secondary" weight="semibold")
        }
        .pad(left=16 top=8 bottom=2)
    }
}
```

`home.ae` 中调用：

```ae
VStack(spacing=0) {
    ProjectNavigator()
    NavSection(title="收藏" icon="star")
    NavSection(title="最近" icon="clock")
}
.w(260)
.bg("$colors.sidebar")
```

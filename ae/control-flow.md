# Control Flow / 控制流

Aether 的控制流组件提供条件渲染和列表渲染能力。当前 If 和 For 的 codegen 支持为部分实现，部分场景使用原生 SwiftUI 条件和循环。

---

## If

条件渲染组件，根据条件决定是否渲染子组件。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| condition | bool | 是 | — | 渲染条件，为 true 时显示子组件 |

支持子组件。

> **注意**：If 在 schema 中有定义，但 codegen 支持为部分实现。当前使用场景中，抽屉（Drawers）使用原生 SwiftUI `if` 语句块实现条件渲染。

### AE 示例

```ae
If(condition={Home.get_is_active()}) {
    Text("Active")
}
```

### SwiftUI 输出

```swift
if viewModel.isActive {
    Text("Active")
}
```

### 多条件分支

AE 中不支持 `Else` / `ElseIf` 组件。需要多个互斥条件时，使用多个 `If` 组件：

```ae
If(condition={Home.get_status() == "loading"}) {
    Loading(text="加载中...")
}
If(condition={Home.get_status() == "empty"}) {
    Empty(title="暂无数据")
}
If(condition={Home.get_status() == "loaded"}) {
    List(data=viewModel.items) {
        ListItem(title="Item")
    }
}
```

### SwiftUI 输出

```swift
if viewModel.status == "loading" {
    LoadingView(text: "加载中...")
} else if viewModel.status == "empty" {
    EmptyView(title: "暂无数据")
} else if viewModel.status == "loaded" {
    List(viewModel.items) { item in
        // ...
    }
}
```

> 注意：codegen 当前对多 If 的合并输出支持有限，可能生成多个独立 `if` 块而非 `if-else if` 链。

---

## For

列表渲染组件，遍历数据源并重复渲染子组件。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 数据源绑定 |
| key | str | 否 | — | 列表项唯一标识字段 |

支持子组件。

> **注意**：For 在 schema 中有定义，但 codegen 支持为部分实现。FileTree 使用原生 SwiftUI `List` 的 `children` 参数实现递归，不依赖 For 组件。

### AE 示例

```ae
For(data=viewModel.items) {
    Text("Item")
}
```

### SwiftUI 输出

```swift
ForEach(viewModel.items) { item in
    Text("Item")
}
```

### 带索引的遍历

```ae
For(data=viewModel.users) {
    ListItem(title="{user.name}" subtitle="{user.email}")
}
```

### SwiftUI 输出

```swift
ForEach(viewModel.users) { user in
    HStack(spacing: 12) {
        VStack(alignment: .leading, spacing: 4) {
            Text(user.name).font(.system(size: 16))
            Text(user.email).font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
        }
    }
}
```

### 嵌套 For

```ae
For(data=viewModel.sections) {
    VStack(spacing=8) {
        Text("{section.title}" size=16 weight="bold")
        For(data={section.items}) {
            ListItem(title="{item.name}")
        }
    }
}
```

### SwiftUI 输出

```swift
ForEach(viewModel.sections) { section in
    VStack(spacing: 8) {
        Text(section.title).font(.system(size: 16)).bold()
        ForEach(section.items) { item in
            HStack(spacing: 12) {
                Text(item.name).font(.system(size: 16))
            }
        }
    }
}
```

---

## Codegen 支持现状

| 功能 | Schema 定义 | Codegen 实现 | 备注 |
|------|------------|-------------|------|
| If 单条件 | 已定义 | 部分实现 | 抽屉场景使用原生 SwiftUI `if` |
| If 多分支 | 未定义 | 未实现 | 需要多个独立 If 组件 |
| For 基础遍历 | 已定义 | 部分实现 | 映射为 `ForEach` |
| For 带 key | 已定义 | 部分实现 | key 字段用于 SwiftUI 标识 |
| For 嵌套 | 未定义 | 未实现 | 嵌套场景需在 ViewModel 中预处理 |
| FileTree 递归 | 无定义 | 完整实现 | 使用 SwiftUI `List(children:)` |
| Drawers 条件 | 无定义 | 完整实现 | 使用原生 SwiftUI `if` 语句块 |

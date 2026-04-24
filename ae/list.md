# List / Grid / FileTree

列表与网格是 Aether 中最常用的数据展示组件。List 和 Grid 均支持数据绑定，FileTree 是内置组件（不在 schema 中定义，但 codegen 完整支持）。

---

## List

列表组件，用于展示垂直方向上的同构数据行。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 绑定的数据源，如 `viewModel.items` |
| spacing | num | 否 | 0 | 行间距 |
| divider | bool | 否 | true | 是否显示行分割线 |
| reorderable | bool | 否 | false | 是否允许拖拽排序 |
| selectionMode | enum | 否 | none | 选择模式：none / single / multiple |

继承 `_style`（w, h, bg, pad, mar, radius, op, shadow, border）。

| 事件 | 签名 | 说明 |
|------|------|------|
| onRefresh | `() => void` | 下拉刷新 |
| onLoadMore | `() => void` | 滚动到底部加载更多 |
| onReorder | `(from: num, to: num) => void` | 拖拽排序回调 |
| onSelect | `(indices: num[]) => void` | 选中项变化回调 |

支持子组件。

### AE 示例

```ae
List(data=viewModel.users spacing=8 divider=true) {
    ListItem(title="Alice" subtitle="Engineer" leading=$assets.avatar trailing=">")
}
```

### SwiftUI 输出

```swift
List(viewModel.users, spacing: 8) { item in
    HStack(spacing: 12) {
        Image("avatar")
        VStack(alignment: .leading, spacing: 4) {
            Text("Alice").font(.system(size: 16))
            Text("Engineer").font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
        }
        Spacer()
        Text(">").foregroundColor(AppColors.text_hint)
    }
    .padding(.vertical, 8)
}
.listRowSeparator(divider ? .visible : .hidden)
```

---

## ListItem

列表行组件，通常作为 List 的子组件使用。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | str | 是 | — | 主标题 |
| subtitle | str | 否 | — | 副标题 |
| leading | str | 否 | — | 左侧图标/图片资源引用 |
| trailing | str | 否 | — | 右侧内容 |
| level | num | 否 | 0 | 层级（用于缩进） |
| indent | num | 否 | 16 | 缩进像素值 |
| selected | bool | 否 | false | 是否选中 |

继承 `_style`。

| 事件 | 签名 | 说明 |
|------|------|------|
| onClick | `() => void` | 整行点击 |
| onTap | `() => void` | 点击手势 |

支持子组件。

### AE 示例

```ae
ListItem(title="设置" leading=$assets.gear trailing="chevron")
    .pad(left=12, right=12)
```

### SwiftUI 输出

```swift
HStack(spacing: 12) {
    Image("gear").frame(width: 20, height: 20)
    Text("设置").font(.system(size: 16))
    Spacer()
    Image(systemName: "chevron.right").foregroundColor(AppColors.text_hint)
}
.padding(.horizontal, 12)
```

---

## Grid

网格布局组件，基于 SwiftUI LazyVGrid 实现。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| columns | num | 否 | 2 | 列数 |
| spacing | num | 否 | 0 | 格子间距 |
| data | str | 否 | — | 绑定的数据源 |

继承 `_style`。支持子组件。

### AE 示例

```ae
Grid(columns=3 spacing=8) {
    GridCell { Text("项目 1") }
    GridCell { Text("项目 2") }
    GridCell { Text("项目 3") }
}
```

### SwiftUI 输出

```swift
LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 8) {
    Text("项目 1")
    Text("项目 2")
    Text("项目 3")
}
```

---

## GridCell

网格单元格，作为 Grid 的子组件。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| colSpan | num | 否 | 1 | 跨列数 |
| rowSpan | num | 否 | 1 | 跨行数 |

继承 `_style`。支持子组件。

### AE 示例

```ae
GridCell { Text("item") }
```

### SwiftUI 输出

```swift
// GridCell 内容直接作为 LazyVGrid 子元素
Text("item")
```

---

## FileTree

内置组件（不在 schema 中定义，但 codegen 完整支持）。用于展示目录树结构，自动生成 SwiftUI 的递归 List。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| root | str | 是 | — | 根目录路径 |
| onSelect | callback | 是 | — | 文件选中回调，如 `{Home.on_file_select()}` |
| showHidden | bool | 否 | false | 是否显示隐藏文件（以 `.` 开头） |
| filter | str | 否 | — | 文件过滤规则，如 `"*.swift"` |

### 自动生成内容

使用 FileTree 时，codegen 会自动在 ViewModel 中生成：

- `@Published var fileTreeItems: [FileTreeItem]` — 树形数据
- `loadFileTree(from:)` 方法 — 递归扫描目录
- `FileTreeItem` 数据模型 — 含 `id`, `name`, `path`, `isDirectory`, `children` 字段

目录排在前面（按字母排序），文件排在后面。目录图标使用 `folder.fill`，文件图标使用 `doc`。

### AE 示例

```ae
FileTree(root="/src" onSelect={Home.on_file_select()})
```

带过滤和显示隐藏文件：

```ae
FileTree(root="/project" onSelect={Home.on_file_select()} showHidden=true filter="*.swift")
```

### SwiftUI 输出

```swift
List(viewModel.fileTreeItems, children: \.children) { item in
    HStack(spacing: 6) {
        Image(systemName: item.isDirectory ? "folder.fill" : "doc")
            .foregroundColor(item.isDirectory ? AppColors.primary : AppColors.text_secondary)
        Text(item.name)
            .font(.system(size: 13))
            .foregroundColor(AppColors.text)
    }
    .onTapGesture { viewModel.onFileSelect(path: item.path) }
}
```

ViewModel 自动生成：

```swift
struct FileTreeItem: Identifiable {
    let id = UUID()
    let name: String
    let path: String
    let isDirectory: Bool
    var children: [FileTreeItem]? = nil
}

// ViewModel 中
@Published var fileTreeItems: [FileTreeItem] = []

private func loadFileTree(from root: String) -> [FileTreeItem] {
    let fm = FileManager.default
    guard let urls = try? fm.contentsOfDirectory(
        at: URL(fileURLWithPath: root),
        includingPropertiesForKeys: [.isDirectoryKey],
        options: []
    ) else { return [] }
    var items: [FileTreeItem] = []
    for url in urls {
        let name = url.lastPathComponent
        if name.hasPrefix(".") { continue }
        let isDir = (try? url.resourceValues(forKeys: [.isDirectoryKey]))?.isDirectory ?? false
        if isDir {
            items.append(FileTreeItem(name: name, path: url.path,
                isDirectory: true, children: loadFileTree(from: url.path)))
        } else {
            items.append(FileTreeItem(name: name, path: url.path,
                isDirectory: false))
        }
    }
    items.sort(by: { a, b in
        if a.isDirectory != b.isDirectory { return a.isDirectory }
        return a.name < b.name
    })
    return items
}
```

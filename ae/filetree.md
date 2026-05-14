# FileTree / 文件树

文件树组件，展示目录树结构。codegen 自动生成 ViewModel 中的数据和方法，支持文件系统实时监控。

---

## 属性

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| path | str | 是 | — | 根目录路径（别名 `root`）。支持状态绑定，如 `{Home.src_path}` |
| expanded | bool | 否 | false | 是否默认展开 |
| showHidden | bool | 否 | false | 是否显示隐藏文件 |
| filter | str | 否 | — | 文件过滤规则，如 `"*.swift"` |
| selected | binding | 否 | — | 当前选中文件路径绑定，如 `{EditorState.active_file}` |
| onSelect | callback | 否 | — | 文件选中回调（单击），如 `{EditorState.preview_file_open}` |
| onOpen | callback | 否 | — | 文件打开回调（双击），如 `{EditorState.open_file}` |
| autoWatch | bool | 否 | false | 自动监控文件系统变化，外部增删文件时实时刷新 |

## 事件

| 事件 | 签名 | 说明 |
|------|------|------|
| onSelect | `() => void` | 文件选中回调（单击） |
| onOpen | `() => void` | 文件打开回调（双击） |

继承 `_style`。不支持子组件。

## 自动生成内容

使用 FileTree 时，codegen 会自动在 ViewModel 中生成：

- `@Published var fileTreeItems: [FileTreeItem]` — 树形数据
- `@Published var expandedPaths: Set<String>` — 展开状态
- `loadFileTree(from:)` 方法 — 递归扫描目录
- `toggleDirectory(path:)` 方法 — 展开/折叠目录
- `FileTreeItem` 数据模型 — 含 `id`, `name`, `path`, `isDirectory`, `children`, `isExpanded` 字段

## 文件系统监控

当 `autoWatch=true` 时，额外生成：

- `private var watcherTokens: [String: UUID]` — FileSystemWatcher 订阅令牌
- `startFileWatching()` / `stopFileWatching()` — 生命周期方法，在 View 的 `onAppear`/`onDisappear` 中自动调用
- reload 方法中自动重新订阅 watcher，路径变化时同步更新监控

`FileSystemWatcher` 使用 macOS 原生 DispatchSource (kqueue) 监控目录变化，300ms 防抖合并事件。当目标目录不存在时，自动监控其父目录，待目录创建后切换为直接监控。

## 排序规则

目录排在前面（按字母排序），文件排在后面。目录图标使用 `folder.fill`，文件图标使用 `doc`。

## AE 示例

基本用法：

```ae
FileTree(path="/src" onSelect={Home.on_file_select()})
```

带路径绑定和自动监控：

```ae
FileTree(path={Home.src_path} autoWatch=true onSelect={EditorState.preview_file_open} onOpen={EditorState.open_file})
```

带过滤和显示隐藏文件：

```ae
FileTree(path="/project" showHidden=true filter="*.swift" onSelect={Home.on_file_select()})
```

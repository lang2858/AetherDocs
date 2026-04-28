# Data Display / 数据展示

数据展示组件用于以结构化的方式呈现信息，包括描述列表、步骤条、时间线、折叠面板、空状态、结果页和骨架屏。

---

## Descriptions

描述列表，以键值对形式展示信息。常用于详情页。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | str | 否 | — | 描述列表标题 |
| column | num | 否 | 1 | 每行列数 |
| bordered | bool | 否 | false | 是否显示边框 |

继承 `_style`。支持子组件（DescriptionsItem）。

### DescriptionsItem

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| label | str | 是 | — | 字段标签 |
| span | num | 否 | 1 | 跨列数 |

### AE 示例

```ae
Descriptions(title="用户信息" column=2 bordered=true) {
    DescriptionsItem(label="姓名") { Text("张三") }
    DescriptionsItem(label="年龄") { Text("28") }
    DescriptionsItem(label="邮箱" span=2) { Text("zhangsan@example.com") }
}
```

### SwiftUI 输出

```swift
VStack(alignment: .leading, spacing: 0) {
    Text("用户信息").font(.system(size: 16)).bold().padding(.bottom, 12)
    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 0) {
        // 姓名
        VStack(alignment: .leading) {
            Text("姓名").font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
            Text("张三").font(.system(size: 15))
        }.padding(12)
        // 年龄
        VStack(alignment: .leading) {
            Text("年龄").font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
            Text("28").font(.system(size: 15))
        }.padding(12)
        // 邮箱（跨2列）
        VStack(alignment: .leading) {
            Text("邮箱").font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
            Text("zhangsan@example.com").font(.system(size: 15))
        }.padding(12).gridCellColumns(2)
    }
    if bordered {
        // 添加边框修饰符
    }
}
```

---

## Steps

步骤条组件，展示流程进度。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| current | num | 否 | 0 | 当前步骤索引 |
| direction | enum | 否 | horizontal | 方向：horizontal / vertical |
| items | str | 否 | — | 步骤项列表 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onChange | `(index: num) => void` | 步骤切换回调 |

继承 `_style`。

### AE 示例

```ae
Steps(current={Home.step} direction="horizontal" items="账号信息,身份验证,完成注册" onChange={Home.on_step_change()})
```

### SwiftUI 输出

```swift
HStack(spacing: 0) {
    ForEach(0..<3, id: \.self) { index in
        HStack(spacing: 8) {
            Circle()
                .fill(index <= viewModel.step ? AppColors.primary : AppColors.text_hint)
                .frame(width: 28, height: 28)
                .overlay(Text("\(index + 1)").foregroundColor(.white).font(.system(size: 13)))
            Text(["账号信息", "身份验证", "完成注册"][index])
                .font(.system(size: 14))
                .foregroundColor(index <= viewModel.step ? AppColors.text : AppColors.text_hint)
        }
        if index < 2 {
            Rectangle()
                .fill(index < viewModel.step ? AppColors.primary : AppColors.divider)
                .frame(height: 2)
        }
    }
}
```

---

## Timeline

时间线组件，展示事件的时间顺序。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| items | str | 否 | — | 时间线条目列表 |

继承 `_style`。

### TimelineItem

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| title | str | 是 | — | 标题 |
| description | str | 否 | — | 描述 |
| time | str | 否 | — | 时间 |
| color | str | 否 | — | 节点颜色 |

### AE 示例

```ae
Timeline(items=[
    { title: "创建项目", time: "2024-01-01", color: "$colors.primary" },
    { title: "开发完成", time: "2024-03-15", description: "所有功能开发完毕" },
    { title: "上线发布", time: "2024-04-01" }
])
```

### SwiftUI 输出

```swift
VStack(alignment: .leading, spacing: 20) {
    ForEach(timelineItems) { item in
        HStack(alignment: .top, spacing: 12) {
            VStack(spacing: 0) {
                Circle()
                    .fill(Color(item.color ?? AppColors.primary))
                    .frame(width: 12, height: 12)
                Rectangle()
                    .fill(AppColors.divider)
                    .frame(width: 2)
                    .frame(maxHeight: .infinity)
            }
            VStack(alignment: .leading, spacing: 4) {
                Text(item.title).font(.system(size: 15))
                if let desc = item.description {
                    Text(desc).font(.system(size: 13)).foregroundColor(AppColors.text_secondary)
                }
                Text(item.time).font(.system(size: 12)).foregroundColor(AppColors.text_hint)
            }
        }
    }
}
```

---

## Collapse

折叠面板，可展开/收起内容区域。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| value | str | 否 | — | 当前展开项 |
| accordion | bool | 否 | false | 是否手风琴模式（只展开一个） |

| 事件 | 签名 | 说明 |
|------|------|------|
| onChange | `(value: str) => void` | 展开项变化回调 |

继承 `_style`。支持子组件（CollapseItem）。

### CollapseItem

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | str | 是 | — | 唯一标识 |
| title | str | 是 | — | 面板标题 |
| icon | str | 否 | — | 标题图标 |
| disabled | bool | 否 | false | 是否禁用 |

### AE 示例

```ae
Collapse(accordion=true) {
    CollapseItem(name="basic" title="基本信息" icon="info") {
        Descriptions(column=2) {
            DescriptionsItem(label="版本") { Text("1.0.0") }
            DescriptionsItem(label="大小") { Text("12.5 MB") }
        }
    }
    CollapseItem(name="detail" title="详细配置") {
        Text("这里是详细配置内容" size=14 color="$colors.text_secondary")
    }
}
```

### SwiftUI 输出

```swift
VStack(spacing: 0) {
    // CollapseItem - 基本信息
    VStack(spacing: 0) {
        HStack {
            Image(systemName: "info")
            Text("基本信息").font(.system(size: 15))
            Spacer()
            Image(systemName: expandedItems.contains("basic") ? "chevron.up" : "chevron.down")
        }
        .padding(.vertical, 12)
        .contentShape(Rectangle())
        .onTapGesture { toggleItem("basic") }
        if expandedItems.contains("basic") {
            // 子内容
            DescriptionsView(column: 2) { /* ... */ }
                .padding(.vertical, 8)
        }
    }
    Divider()
    // CollapseItem - 详细配置
    // ...
}
```

---

## Empty

空状态组件，无数据时的占位提示。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| icon | str | 否 | — | 空状态图标 |
| title | str | 否 | — | 标题 |
| description | str | 否 | — | 描述 |
| actionText | str | 否 | — | 操作按钮文字 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onAction | `() => void` | 操作按钮点击 |

继承 `_style`。支持子组件。

### AE 示例

```ae
Empty(icon="inbox" title="暂无数据" description="点击按钮创建第一条记录" actionText="新建")
    .onAction={Home.on_create()}
```

### SwiftUI 输出

```swift
VStack(spacing: 16) {
    Image(systemName: "inbox")
        .font(.system(size: 48))
        .foregroundColor(AppColors.text_hint)
    Text("暂无数据").font(.system(size: 16)).foregroundColor(AppColors.text_secondary)
    Text("点击按钮创建第一条记录").font(.system(size: 13)).foregroundColor(AppColors.text_hint)
    Button("新建") { viewModel.onCreate() }
        .buttonStyle(.bordered)
}
.frame(maxWidth: .infinity, maxHeight: .infinity)
```

---

## Result

结果页组件，展示操作结果（成功、失败等）。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| status | enum | 否 | info | 状态：success / error / warning / info / empty |
| title | str | 是 | — | 标题 |
| description | str | 否 | — | 描述信息 |

继承 `_style`。支持子组件（可放操作按钮）。

### AE 示例

```ae
Result(status="success" title="提交成功" description="您的申请已提交审核") {
    Button("返回首页" onClick={Home.go_home()})
}
```

### SwiftUI 输出

```swift
VStack(spacing: 16) {
    Image(systemName: "checkmark.circle.fill")
        .font(.system(size: 64))
        .foregroundColor(AppColors.success)
    Text("提交成功").font(.system(size: 20)).bold()
    Text("您的申请已提交审核").font(.system(size: 14)).foregroundColor(AppColors.text_secondary)
    Button("返回首页") { viewModel.goHome() }
        .buttonStyle(.borderedProminent)
}
.frame(maxWidth: .infinity, maxHeight: .infinity)
```

---

## Skeleton

骨架屏，数据加载时的占位动画。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| loading | bool | 否 | true | 是否显示骨架状态 |
| rows | num | 否 | 3 | 占位行数 |
| avatar | bool | 否 | false | 是否显示头像占位 |
| animated | bool | 否 | true | 是否启用动画 |

继承 `_style`。支持子组件（loading 为 false 时显示实际内容）。

### AE 示例

```ae
Skeleton(loading={Home.is_loading} rows=3 avatar=true animated=true) {
    VStack(spacing=12) {
        HStack(spacing=12) {
            Image(src=$assets.avatar radius=20)
            VStack(alignment="leading" spacing=4) {
                Text("用户名" size=16 weight="bold")
                Text("这是真实内容" size=14 color="$colors.text_secondary")
            }
        }
    }
}
```

### SwiftUI 输出

```swift
if viewModel.isLoading {
    VStack(spacing: 12) {
        HStack(spacing: 12) {
            if avatar {
                Circle()
                    .fill(AppColors.skeleton)
                    .frame(width: 40, height: 40)
            }
            VStack(alignment: .leading, spacing: 8) {
                ForEach(0..<rows, id: \.self) { _ in
                    Rectangle()
                        .fill(AppColors.skeleton)
                        .frame(height: 14)
                        .frame(maxWidth: .infinity)
                }
            }
        }
    }
    .shimmer(active: animated)  // 自定义 shimmer 修饰符
} else {
    // 实际子组件内容
    VStack(spacing: 12) {
        // ...
    }
}
```

---

## LineChart

折线图组件，展示趋势数据。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 数据源名称 |
| xKey | str | 否 | — | X 轴字段名 |
| yKey | str | 否 | — | Y 轴字段名 |
| lineColor | str | 否 | — | 线条颜色 |
| lineWidth | num | 否 | — | 线条宽度 |
| showPoints | bool | 否 | false | 是否显示数据点 |
| animated | bool | 否 | false | 是否启用动画 |

继承 `_style`。不支持子组件。

### AE 示例

```ae
LineChart(data=$stats.trend xKey="date" yKey="value" lineColor=$colors.primary)
```

---

## BarChart

柱状图组件，展示分类数据对比。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 数据源名称 |
| barColor | str | 否 | — | 柱体颜色 |
| animated | bool | 否 | false | 是否启用动画 |

继承 `_style`。不支持子组件。

### AE 示例

```ae
BarChart(data=$stats.revenue barColor=$colors.primary)
```

---

## PieChart

饼图组件，展示占比分布。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 数据源名称 |
| colors | str | 否 | — | 颜色列表 |
| showLabels | bool | 否 | false | 是否显示标签 |

继承 `_style`。不支持子组件。

### AE 示例

```ae
PieChart(data=$stats.distribution colors="primary,secondary,accent" showLabels=true)
```

---

## Gauge

仪表盘组件，展示单一指标值。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| value | num | 是 | — | 当前值 |
| minValue | num | 否 | — | 最小值 |
| maxValue | num | 否 | — | 最大值 |
| style | enum | 否 | arc | 样式：`arc` / `linear` |

继承 `_style`。不支持子组件。

### AE 示例

```ae
Gauge(value=72 minValue=0 maxValue=100 style="arc")
```

---

## AreaChart

面积图组件，展示累计趋势。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 数据源名称 |
| areaColor | str | 否 | — | 填充颜色 |
| animated | bool | 否 | false | 是否启用动画 |

继承 `_style`。不支持子组件。

### AE 示例

```ae
AreaChart(data=$stats.cumulative areaColor=$colors.primary)
```

---

## ScatterChart

散点图组件，展示数据分布关系。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| data | str | 是 | — | 数据源名称 |
| pointColor | str | 否 | — | 数据点颜色 |
| pointSize | num | 否 | — | 数据点大小 |

继承 `_style`。不支持子组件。

### AE 示例

```ae
ScatterChart(data=$stats.correlation pointColor=$colors.secondary pointSize=4)
```

---

## FileTree

文件树组件，展示目录树结构。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| path | str | 是 | — | 根目录路径（别名 `root`） |
| expanded | bool | 否 | false | 是否默认展开 |
| showHidden | bool | 否 | false | 是否显示隐藏文件 |
| filter | str | 否 | — | 文件过滤规则，如 `"*.swift"` |

| 事件 | 签名 | 说明 |
|------|------|------|
| onSelect | `() => void` | 文件选中回调 |

继承 `_style`。不支持子组件。

### AE 示例

```ae
FileTree(path="/src" onSelect={Home.on_file_select()})
```

带过滤和显示隐藏文件：

```ae
FileTree(path="/project" showHidden=true filter="*.swift" onSelect={Home.on_file_select()})
```

---

## MapView

地图视图组件，支持地图类型选择。

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| latitude | num | — | 中心纬度 |
| longitude | num | — | 中心经度 |
| zoom | num | — | 缩放级别 |
| showUserLocation | bool | false | 是否显示用户当前位置 |
| mapType | enum | standard | 地图类型：`standard` / `satellite` / `hybrid` |

继承 `_style`。

### AE 示例

```ae
MapView(latitude=39.9042 longitude=116.4074 zoom=12 showUserLocation=true mapType="standard")
    .w(100%)
    .h(300)
    .radius(12)
```

# 响应式布局

Aether 提供三层渐进式响应式布局能力，从简单的自动换行到完整的断点系统，覆盖从组件级到页面级的响应式需求。

## 为什么需要响应式

传统绝对坐标布局在容器尺寸变化时内容会溢出或截断。Aether 的响应式能力让 UI 自动适应可用空间：

- **SplitView 拖动缩小时**，内容自动换行而非溢出
- **窗口大小变化时**，Grid 自动增减列数
- **不同设备尺寸间**，布局结构自动切换

三层能力独立可用，按需选择：

| 层级 | 能力 | 适用场景 |
|------|------|----------|
| 第一层 | Flex Wrap + Clipped | 内容自动换行、防止溢出 |
| 第二层 | 自适应 Grid | 数据列表、卡片网格 |
| 第三层 | 断点系统 | 布局结构切换（侧边栏显隐等） |

---

## Flex Wrap

HStack 和 VStack 支持 `wrap` 属性，子元素超出容器宽度时自动换行。

### 基本用法

```ae
HStack(wrap="wrap", spacing=4) {
    :book_spine(title="产品设计" icon="lightbulb")
    :book_spine(title="技术笔记" icon="gearshape")
    :book_spine(title="会议纪要" icon="doc.text")
    :book_spine(title="灵感记录" icon="sparkles")
}
```

容器宽度足够时，所有子元素排在一行；宽度不足时，自动换到下一行。

### wrap 属性值

| 值 | 行为 |
|---|---|
| `nowrap` | 默认，不换行 |
| `wrap` | 正向换行，行从上到下排列 |
| `wrapReverse` | 反向换行，行从下到上排列 |

### 实现原理

- macOS 13+ / iOS 16+：基于 SwiftUI `Layout` 协议实现 `AeFlowLayout`，精确计算每个子元素的位置和换行点
- macOS 12 降级：退化为水平 `ScrollView`，内容可横向滚动

---

## Clipped

`.clipped()` 修饰符裁剪超出父容器边界的内容，防止溢出。

```ae
VStack() {
    :wide_content()
}
.clipped()
```

SplitView 的两个面板已自动应用 `.clipped()`，拖动缩小面板时内容不会溢出到相邻面板。

---

## 自适应 Grid

Grid 支持 `columns="auto"`，根据容器宽度自动调整列数。

### 基本用法

```ae
Grid(columns="auto", spacing=8, minItemWidth=120) {
    GridCell() {
        :card(title="项目A")
    }
    GridCell() {
        :card(title="项目B")
    }
}
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `columns` | String | `"2"` | `"auto"` 自适应列数，或数字字符串固定列数 |
| `spacing` | Number | `0` | 网格间距 |
| `minItemWidth` | Number | `100` | 自适应模式下每项最小宽度 |

### 列数计算

- `columns="auto"` → 容器宽度能放几列就放几列，每列至少 `minItemWidth` 宽
- `columns="3"` → 固定 3 列，每列等宽

宽容器时自动多列，窄容器时自动少列，无需手动判断。

---

## 断点系统

断点系统提供类似 CSS `@media` 的能力，根据容器宽度切换不同的布局结构。

### BreakpointContainer

包裹内容区域，根据宽度自动计算断点级别，注入到 SwiftUI Environment。

```ae
BreakpointContainer(sm=0, md=320, lg=600) {
    If(condition="breakpoint >= \"md\"") {
        :sidebar()
    }
    :main_content()
}
```

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `sm` | Number | `0` | 小屏断点阈值 |
| `md` | Number | `320` | 中屏断点阈值 |
| `lg` | Number | `600` | 大屏断点阈值 |

#### 断点级别

宽度 >= `lg` 为 `lg`，>= `md` 为 `md`，其余为 `sm`。

### If(breakpoint) 条件布局

在 BreakpointContainer 内部，使用 `If` 组件根据断点级别条件渲染。

```ae
// 宽屏显示侧边栏
If(condition="breakpoint >= \"md\"") {
    :sidebar()
}

// 窄屏显示底部导航
If(condition="breakpoint < \"md\"") {
    :mobile_nav()
}
```

#### 支持的比较操作

`>=`、`<=`、`>`、`<`、`==`

---

## 完整示例

左侧书架组件，使用三层响应式能力：

```ae
component() {
    BreakpointContainer(sm=0, md=180, lg=300) {
        VStack(spacing=0) {
            HStack() {
                Text("📚 归档").size(13).bold().color($colors.text)
                Spacer()
                If(condition="breakpoint >= \"md\"") {
                    Icon(name="plus.circle" size=14 color=$colors.accent)
                }
            }

            ScrollView(.vertical) {
                // Flex Wrap: 书脊自动换行
                HStack(wrap="wrap", spacing=4) {
                    :book_spine(title="产品设计" icon="lightbulb")
                    :book_spine(title="技术笔记" icon="gearshape")
                    :book_spine(title="会议纪要" icon="doc.text")
                }
            }
            .flexGrow(1)
        }
        .bg($colors.sidebar_bg)
    }
}
```

---

## 与其他框架对照

| 能力 | Aether | CSS | ArkUI |
|---|---|---|---|
| 自动换行 | `HStack(wrap="wrap")` | `flex-wrap: wrap` | `Flex(wrap: FlexWrap.Wrap)` |
| 自适应列数 | `Grid(columns="auto")` | `repeat(auto-fill, minmax())` | `GridRow(columnsTemplate)` |
| 断点感知 | `BreakpointContainer` + `If(breakpoint)` | `@media (min-width)` | `BreakpointSystem` |
| 内容裁剪 | `.clipped()` | `overflow: hidden` | `clip(ContentClip)` |

# Charts / 图表组件

图表组件用于数据可视化，支持折线图、柱状图、饼图、仪表盘、面积图和散点图。

所有图表组件通过 `sys_chart_*` 系列 API 与 Rust 逻辑层交互，支持动态数据更新、高亮选中和降采样优化。

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

## 图表系统 API

Rust 逻辑层可通过以下 `sys_chart_*` 函数控制图表行为：

| 函数 | 签名 | 说明 |
|---|---|---|
| `sys_chart_broadcast_filter` | `(chart_id: String, filter: String)` | 广播过滤器到图表 |
| `sys_chart_set_highlight` | `(chart_id: String, index: i32)` | 设置高亮数据点 |
| `sys_chart_clear_highlight` | `(chart_id: String)` | 清除高亮 |
| `sys_chart_downsample` | `(chart_id: String, threshold: i32)` | 降采样优化 |

详见 [系统 API - 图表](../logic/system-api.md#图表chart)。

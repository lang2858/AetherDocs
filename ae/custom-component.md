# 自定义组件

Aether 支持通过 `component` 关键字定义可复用的自定义组件，并在页面中通过 `:Name()` 语法调用。

## 组件定义

### 语法

```ae
component ComponentName(param1, param2, param3="default_value") {
    // 组件体：合法的 AE 视图语法
}
```

- **关键字**：`component`
- **名称**：大写开头的标识符（PascalCase 或 snake_case 均可，推荐 PascalCase）
- **参数列表**：可选，圆括号包裹，逗号分隔
- **参数默认值**：可选，`name="value"` 格式，字符串默认值不需要保留引号
- **组件体**：花括号包裹的 AE 视图树

### 参数

参数支持两种形式：

| 形式 | 语法 | 示例 |
|------|------|------|
| 无默认值 | `name` | `icon`, `label`, `onClick` |
| 有默认值 | `name=value` | `width=220`, `color="$colors.primary"` |
| 类型标注 | `name: Type` | `active: Bool`, `count: Int` |

参数类型支持 `String`、`Bool`、`Int`、`Double` 等 Swift 类型。`Bool` 类型参数在调用时使用 `true`/`false` 字面量。

```ae
component BoardItem(title: String, icon: String, active: Bool) {
    HStack(spacing=8) {
        Icon(name=$icon size=14 color=$colors.text_secondary)
        Text($title).size(13).color($colors.text)
        Spacer()
    }
    .pad(left=8, right=8, top=6, bottom=6)
    .bg($colors.paper_bg, active=$active)
    .radius(6)
}
```

调用时：

```ae
:BoardItem(title="产品设计" icon="lightbulb" active=true)
:BoardItem(title="技术笔记" icon="gearshape" active=false)
```

字符串默认值在定义时需要用引号包裹，解析后自动去除引号存储。

### 示例

```ae
component ActionButton(icon, label, onClick, nameColor="$colors.text_on_primary", width=220) {
    HStack(spacing=8) {
        Icon(name="{icon}" size=16)
        Text("{label}" size=14 color="{nameColor}")
    }
    .h(40)
    .w({width})
    .bg("$colors.accent")
}
```

## 组件调用

### 语法

```ae
:ComponentName(key1=value1 key2=value2 ...) .modifiers
```

- **冒号前缀** `:` 区分自定义组件调用与内置组件
- **参数传递**：`key=value` 格式，空格分隔
- **尾部修饰符**：闭括号后可追加 `.modifier()`

### 参数值类型

调用时参数值支持以下类型：

| 类型 | 示例 | 说明 |
|------|------|------|
| 字符串 | `icon="star"` | 双引号包裹 |
| 数字 | `width=220` | 直接写数值 |
| 回调绑定 | `onClick={Home.on_click()}` | 花括号包裹 |
| 资源引用 | `icon=$assets.star` | `$assets` 前缀 |
| 国际化引用 | `label=@i18n.home.title` | `@i18n` 前缀 |

### 示例

```ae
:ActionButton(icon="star" label="收藏" onClick={Home.on_favorite()}) .pad(12)

:ActionButton(icon="share" label=@i18n.common.share onClick={PM.share()}) .radius(8)
```

## 参数替换

组件体中的 `{paramName}` 占位符在展开时被替换为实际参数值：

1. 如果调用时传入了该参数，使用传入值
2. 如果未传入但定义了默认值，使用默认值
3. 如果两者都没有，占位符保留原样

替换规则：
- 只替换花括号内为纯标识符（字母、数字、下划线）的占位符
- 不替换包含 `.` 或其他特殊字符的花括号内容（如 `{Home.count}` 状态绑定不会被替换）

## 定义位置

自定义组件可以在两个位置定义：

### 1. components/ 目录（独立文件）

`src/ui/components/` 下每个 `.ae` 文件定义一个组件，文件名自动转换为 PascalCase 组件名：

| 文件路径 | 组件名 | 调用方式 |
|---------|--------|---------|
| `components/card.ae` | `Card` | `:Card(...)` |
| `components/nav_bar.ae` | `NavBar` | `:NavBar(...)` |

### 2. 页面文件内联

在页面 `.ae` 文件中直接定义，仅在该页面内可用：

```ae
component StatusBar() {
    HStack(spacing=8) {
        Text("Ready").size(12)
        Spacer()
    }
    .h(24)
}

VStack {
    :StatusBar()
    Text("Hello!")
}
```

## 检测与校验

Lint 层会校验自定义组件相关错误：

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E012 | Error | 自定义组件 `:Name` 被调用但未找到定义 |

详见 [诊断与检测](diagnostics.md)。

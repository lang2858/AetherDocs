# AE 语法基础

AE（Aether Expression）是 Aether 框架的声明式 UI 描述语言，用于描述界面结构和交互逻辑。本章介绍 AE 的核心语法规则。

---

## 声明式组件语法

AE 使用声明式语法描述组件树，基本格式为：

```
ComponentName(props) { children }
```

- 组件名大写开头（`VStack`、`Text`、`Button`）
- 属性写在括号 `()` 内
- 子组件写在花括号 `{}` 内
- 无子组件时可省略花括号

```ae
VStack(spacing=12) {
    Text("标题" size=20 weight="bold")
    Text("正文内容" size=14 color="#8A90A2")
}
```

---

## 注释

单行注释使用 `//`：

```ae
// 这是一个注释
Text("Hello")
// Text("被注释掉的组件")
```

---

## 点修饰符（Dot Modifiers）

点修饰符以链式调用方式追加在组件后，用于设置样式、尺寸、间距等：

```ae
Text("Hello").size(14).color("#FFF").pad(8)
```

修饰符可以连续链式调用，执行顺序从左到右：

```ae
Rectangle().w(6).h(32).bg("#1E2333").radius(3)
```

---

## Text 内联属性

`Text` 组件支持在括号内直接书写属性，这是 AE 的特殊语法糖：

```ae
Text("内容" size=14 color="#FFF" weight="bold")
```

等价于：

```ae
Text("内容").size(14).color("#FFF").bold()
```

可用内联属性：`size`、`weight`、`color`、`numberFormat`、`decimalPlaces`、`prefix`、`suffix`、`autoScale`、`minScale`、`font`。

---

## 字符串值

字符串值使用双引号包裹，内部字符不需要转义（包括花括号）：

```ae
Text("Hello World")
Text("内容" color="#FF0000")
Text("格式: {name}")
```

编译器会正确识别字符串内部的花括号，不会将其误认为 AE 语法结构。

---

## 颜色引用

AE 支持三种颜色表示方式：

| 格式 | 说明 | 示例 |
|------|------|------|
| `"#hex"` | 十六进制颜色值 | `"#121622"`、`"#FFF"` |
| `$colors.token` | 主题颜色 Token 引用 | `$colors.primary`、`$colors.text` |
| `Color.xxx` | SwiftUI 内置颜色名 | `Color.red`、`Color.blue` |

```ae
// 十六进制
.bg("#121622")

// 主题 Token
.bg($colors.primary)
.color($colors.text)

// 内置颜色
.color(Color.red)
```

---

## 状态绑定

使用花括号 `{}` 包裹的状态绑定会自动映射到 ViewModel 的逻辑方法：

| AE 语法 | SwiftUI 映射 | 说明 |
|---------|-------------|------|
| `{TypeName.field}` | `viewModel.logic.getXxx()` | 读取字段值 |
| `{TypeName.method()}` | `viewModel.logic.method()` | 调用方法 |

```ae
// 读取状态
Text({Home.title})

// 绑定可变状态
TextField(value={Home.search_text} placeholder="搜索")

// 调用方法
Button("提交" onClick={Home.submit()})
```

---

## 事件绑定

事件绑定使用 `onXxx={TypeName.method()}` 语法：

```ae
Button("点击" onClick={Home.on_click()})
View(onTap={Detail.show_menu()})
View(onLongPress={Detail.edit_mode()})
Toggle(value={Settings.dark_mode} onChange={Settings.toggle_dark()})
```

---

## 主题引用

AE 通过 `$` 前缀引用主题系统中的设计 Token：

| 引用方式 | 说明 | 示例 |
|---------|------|------|
| `$colors.xxx` | 颜色 Token | `$colors.primary`、`$colors.background` |
| `$typography.xxx` | 排版 Token | `$typography.headline`、`$typography.body` |
| `$spacing.xxx` | 间距 Token | `$spacing.md`、`$spacing.lg` |
| `$radius.xxx` | 圆角 Token | `$radius.sm`、`$radius.md` |

```ae
VStack(spacing=$spacing.md) {
    Text("标题" size=$typography.headline)
}
.bg($colors.background)
.radius($radius.md)
```

---

## 资源引用

使用 `$assets` 引用 `src/assets/` 下的 SVG 资源。引用路径与目录结构对应，用 `.` 代替 `/`：

| 目录结构 | AE 引用 | 生成 Swift |
|---------|---------|-----------|
| `src/assets/logo.svg` | `$assets.logo` | `AppAssets.logo` |
| `src/assets/tab/home.svg` | `$assets.tab.home` | `AppAssets.tab_home` |

| 引用方式 | 说明 | 示例 |
|---------|------|------|
| `$assets.xxx` | 静态资源引用 | `$assets.logo`、`$assets.tab.home` |
| `$assets.{param}` | 动态资源引用 | `$assets.{icon}` |

```ae
// 静态资源
Image($assets.logo).w(32).h(32)

// 子目录资源：src/assets/tab/home.svg
Image($assets.tab.home).w(24).h(24)

// 按钮图标
Button($assets.icon_add "新建" onClick={Home.create()})
```

> 💡 当需要复用一段 UI 时，可以使用[自定义组件](/components/custom-components)，用 `:` 前缀调用。

---

## 国际化引用

使用 `@i18n` 前缀引用国际化字符串：

```ae
Text(@i18n.home.title)
Button(@i18n.common.confirm onClick={Home.confirm()})
```

格式为 `@i18n.章节.键名`，运行时根据当前语言环境自动选择对应翻译。

---

## 嵌套深度

AE 组件嵌套深度无限制，可以任意层级组合：

```ae
ScrollView(.vertical) {
    VStack(spacing=16) {
        Card(title="用户信息") {
            HStack(spacing=12) {
                Avatar(src=$assets.avatar size=48)
                VStack(spacing=4) {
                    Text("张三" size=16 weight="bold")
                    Text("产品设计师" size=13 color="#8A90A2")
                }
            }
        }
        Section(title="设置") {
            Form {
                FormItem(label="通知" required=true) {
                    Toggle(value={Settings.notify} onChange={Settings.toggle_notify()})
                }
            }
        }
    }
    .pad(16)
}
```

---

## 综合示例

下面是一个完整示例，展示了多种语法特性的组合使用：

```ae
VStack(spacing=$spacing.md) {
    // 头部
    HStack {
        Image($assets.logo).w(40).h(40)
        Text(@i18n.home.title size=20 weight="bold")
            .color($colors.text)
        Spacer()
        Icon(name="gearshape.fill" size=20 color=$colors.secondary)
            .onTap({Home.open_settings()})
    }
    .pad(16)
    .bg($colors.background)

    // 搜索栏
    SearchBar(value={Home.search_text} placeholder=@i18n.home.search)
        .pad(left=16, right=16)

    // 内容列表
    ScrollView(.vertical) {
        VStack(spacing=$spacing.sm) {
            Card(title={Item.name} subtitle={Item.desc} onClick={Item.open()})
        }
        .pad(16)
    }
    .flexGrow(1)
}
```

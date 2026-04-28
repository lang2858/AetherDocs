# 诊断与检测

Aether 采用三层流水线架构，在构建过程中逐步检测和报告错误。

## 检测流水线

```
.ae 源文件
    ↓
aether-lang (Parser)
    ├─ 语法解析 → AeDoc IR
    └─ 语法诊断 (E010 / E011 / E013)
    ↓
aether-lint (Semantic Lint)
    ├─ 语义校验 → Vec<Diagnostic>
    └─ 语义诊断 (E012 / E014–E024 / W002)
    ↓
aether-lint (Config Lint)
    ├─ 配置校验 → Vec<Diagnostic>
    └─ 配置诊断 (E030–E041)
    ↓
aether-codegen
    └─ IR → 平台代码 (不做校验，只做映射)
```

核心原则：**CodeGen 不做校验，只做映射。** CodeGen 接收已经过校验的 IR，只需生成平台代码。

## 语法诊断（Parser 层）

由 `aether-lang` 在解析阶段产出，报告基本的语法错误。

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E010 | Error | 组件名不在规范中（可能是拼写错误或未定义的自定义组件） |
| E011 | Error | 修饰符不在规范中（未知的 `.modifier()`） |
| E013 | Error | 花括号 / 圆括号不匹配（未闭合的 `{` 或多余的 `}`） |

### 示例

```ae
// E010: VStacdk 不在组件规范中
VStacdk { Text("hi") }

// E011: .unknownMod 不在修饰符规范中
Text("hi").unknownMod()

// E013: 缺少闭合 }
VStack {
    Text("hi")
```

## 语义诊断（Lint 层）

由 `aether-lint` 对 AeDoc IR 进行语义校验。根据可用上下文的不同，提供四个层级的校验函数：

### 校验函数层级

| 函数 | 可用上下文 | 校验范围 |
|------|-----------|---------|
| `lint()` | 基础 IR | E012 / E014–E017 / E020 / W002 |
| `lint_with_theme()` | + 主题配置 | + E021 |
| `lint_with_theme_and_extras()` | + 外部组件名 | E012 支持跨文件组件 |
| `lint_full()` | + 资源名 / i18n 键 / Rust 类型与方法 | + E022 / E023 / E024 |

### 组件与属性校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E012 | Error | 自定义组件 `:Name` 被调用但未找到定义 |
| E014 | Warning | 属性不在组件规范中 |
| E015 | Warning | 属性值类型不匹配（如期望数字但传入字符串，修饰符参数不匹配） |
| E016 | Warning | 组件缺少必填属性 |
| E017 | Warning | 属性值不在允许列表中（枚举 / 布尔值不合法） |
| W002 | Warning | 组件嵌套违规（如 Spacer / Divider 不应有子组件） |

### 回调与绑定校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E020 | Warning | 回调属性值应使用 `{}` 包裹 |
| E021 | Warning/Error | 主题颜色引用 `$colors.xxx` 未定义，或使用了错误语法 `$colors->xxx` |
| E022 | Error | 回调绑定的 Rust 类名或方法名不存在 |

### 资源引用校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E023 | Error | 资源引用 `$assets.xxx` 不存在 |
| E024 | Error | 国际化引用 `@i18n.xxx.yyy` 不存在 |

### 示例

```ae
// E012: StatusBar 未定义
:StatusBar()

// E014: VStack 没有 "unknown" 属性
VStack(unknown=12) { Text("hi") }

// E016: Toolbar 缺少必填属性 height
Toolbar() { Text("hi") }

// E021: 主题中没有 "custom_red" 颜色
Text("hi").color("$colors.custom_red")

// E022: Rust 中不存在 "Homee" 结构体
Button("Go" onClick={Homee.on_click()})

// E023: 资源中没有 "missing_icon"
Icon(name=$assets.missing_icon)

// E024: i18n 中没有 "home.greeting"
Text(@i18n.home.greeting)
```

## 配置诊断（Config Lint 层）

由 `aether-lint` 对 `aether.toml`、`theme.toml`、`i18n/*.toml` 配置文件进行校验。

### aether.toml 校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E030 | Warning | 未知顶级配置段 `[section]` |
| E031 | Warning | 段内未知字段 |
| E032 | Warning | 字段值类型不匹配（如应为布尔值但传入了字符串） |
| E033 | Warning | 枚举值不在允许列表中（如 titlebar_style、navigation.style） |
| E034 | Warning | 未知平台名称 |

### theme.toml 校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E035 | Warning/Error | 未知配置段或语法错误 |
| E036 | Warning | 颜色值格式不正确（应为 `#RRGGBB` 或 `$colors.xxx`） |
| E037 | Warning | 字体 weight 值不在允许列表中 |

### i18n 校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E038 | Warning/Error | 键名格式错误或语法错误 |
| E039 | Warning | 值不是字符串类型 |

### 资源引用校验

| 错误码 | 级别 | 说明 |
|--------|------|------|
| E040 | Warning | 资源 / 国际化引用格式错误（应为 `$assets.name` 或 `@i18n.group.key`） |
| E041 | Warning | 主题引用 `$colors.xxx` / `$spacing.xxx` / `$radius.xxx` 未定义 |

## 错误码总览

| 范围 | 产出层 | 说明 |
|------|--------|------|
| E010–E013 | aether-lang (Parser) | 语法错误 |
| E014–E024 | aether-lint (Semantic) | 语义错误与警告 |
| W002 | aether-lint (Semantic) | 组件嵌套警告 |
| E030–E041 | aether-lint (Config) | 配置文件错误与警告 |

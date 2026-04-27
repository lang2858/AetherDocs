# 诊断系统

Aether 编译器在代码生成阶段会验证 AE 源码中的主题引用，发现错误时报告诊断信息并中断构建，避免问题流入 Xcode 编译阶段。

## 错误码

### E001 — 颜色引用不存在

引用了主题中未定义的 `$colors.xxx`。

```ae
// 错误: 主题中没有 "border" 颜色
.bg($colors.border)
```

```
error[E001]: 颜色 '$colors.border' 不存在，请检查 src/themes/ 中的主题配置
  └─ src/ui/home.ae:7
```

### E002 — 间距引用不存在

引用了主题中未定义的 `$spacing.xxx`。

```
error[E002]: 间距 '$spacing.xxx' 不存在，请检查 src/themes/ 中的主题配置
```

### E003 — 圆角引用不存在

引用了主题中未定义的 `$radius.xxx`。

```
error[E003]: 圆角 '$radius.xxx' 不存在，请检查 src/themes/ 中的主题配置
```

### E004 — 排版引用不存在

引用了主题中未定义的 `$typography.xxx`。

```
error[E004]: 排版 '$typography.xxx' 不存在，请检查 src/themes/ 中的主题配置
```

## 警告码

### W001 — 颜色 fallback

代码中硬编码使用了一个主题中不存在的颜色名，编译器自动使用 fallback 值。

```
warning[W001]: 主题颜色 'xxx' 不存在，使用 fallback 'yyy'，请检查 src/themes/ 中的主题配置
```

## 输出格式

- **文件位置**：从项目根目录的相对路径 + 行号，如 `src/ui/home.ae:12`
- **VS Code 终端**：文件路径可点击跳转到源码位置
- **其他终端**：输出绝对路径 `file:line` 格式

## 行为规则

- **Error 级别**：中断构建，不执行 Rust 编译和 Xcode 构建，退出码为 1
- **Warning 级别**：仅打印提示，不中断构建

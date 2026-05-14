# CodeBlock / Markdown / RichText

代码块、Markdown 渲染和富文本组件，用于展示结构化文本内容。

---

## CodeBlock

代码块组件，展示带语法高亮的代码片段。支持折叠、语言标注和一键复制。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| code | str | 是 | — | 代码内容（字符串字面量或状态绑定） |
| language | str | 否 | — | 语言标识，如 `"swift"`、`"rust"`、`"python"` |
| collapsed | bool | 否 | false | 是否默认折叠 |
| showLineNumbers | bool | 否 | false | 是否显示行号 |
| showCopyButton | bool | 否 | true | 是否显示复制按钮 |

继承 `_style`。不支持子组件。

### 代码内容来源

`code` 属性支持两种来源：

1. **字符串字面量**：`code="print(\"hello\")"` — 静态代码
2. **状态绑定**：`code={Editor.current_code}` — 动态代码，运行时从逻辑层取值

### AE 示例

```ae
CodeBlock(code="let x = 42\nprint(x)" language="swift" showLineNumbers=true)
```

绑定状态：

```ae
CodeBlock(code={Editor.current_code} language={Editor.file_language} collapsed={Editor.is_collapsed})
```

### 折叠行为

- `collapsed=true`：默认折叠，只显示前 3 行 + "展开" 按钮
- 用户点击 "展开" 可展开完整代码
- 折叠状态由组件内部管理，无需外部状态绑定

---

## Markdown

Markdown 渲染组件，将 Markdown 文本渲染为富文本视图。支持 CommonMark 子集。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| content | str | 是 | — | Markdown 文本内容 |
| style | enum | 否 | default | 渲染样式：`default` / `compact` / `document` |

继承 `_style`。支持子组件（自定义渲染块）。

### 支持的 Markdown 语法

| 语法 | 示例 |
|------|------|
| 标题 | `# H1` / `## H2` / `### H3` |
| 粗体 | `**bold**` |
| 斜体 | `*italic*` |
| 行内代码 | `` `code` `` |
| 代码块 | ` ```lang ... ``` ` |
| 链接 | `[text](url)` |
| 列表 | `- item` / `1. item` |
| 引用 | `> quote` |
| 分割线 | `---` |

### AE 示例

```ae
Markdown(content={Article.body} style="document")
```

---

## RichText

富文本组件，通过 attributed string 渲染混合样式的文本。适用于需要段落级样式控制的场景。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| content | str | 是 | — | 富文本内容（HTML 或 attributed string 格式） |
| format | enum | 否 | auto | 内容格式：`html` / `markdown` / `auto` |

继承 `_style`。不支持子组件。

### AE 示例

```ae
RichText(content={Article.html_body} format="html")
```

```ae
RichText(content="**Bold** and *italic* text" format="markdown")
```

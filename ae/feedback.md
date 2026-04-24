# Feedback / 反馈组件

反馈组件用于向用户展示操作状态、进度、提示信息等。包含进度条、加载状态、Toast、对话框、ActionSheet、Snackbar、Modal、BottomSheet 和 Popup。

---

## Progress

进度条组件，支持线性和环形两种样式。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| value | num | 否 | — | 当前进度值 |
| max | num | 否 | 100 | 最大值 |
| type | enum | 否 | linear | 样式：linear / circular |
| indeterminate | bool | 否 | false | 不确定进度（加载动画） |

继承 `_style`。不支持子组件。

### AE 示例

```ae
// 线性进度条
Progress(value=60 max=100 type="linear")

// 环形不确定进度
Progress(type="circular" indeterminate=true)
```

### SwiftUI 输出

```swift
// 线性
ProgressView(value: 60, total: 100)
    .progressViewStyle(.linear)

// 环形不确定
ProgressView()
    .progressViewStyle(.circular)
```

---

## Loading

加载中占位组件。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| text | str | 否 | — | 加载提示文字 |
| size | enum | 否 | medium | 尺寸：small / medium / large |

继承 `_style`。不支持子组件。

### AE 示例

```ae
Loading(text="加载中..." size="large")
```

### SwiftUI 输出

```swift
VStack(spacing: 12) {
    ProgressView()
        .progressViewStyle(.circular)
        .scaleEffect(size == "large" ? 1.5 : size == "small" ? 0.7 : 1.0)
    Text("加载中...").font(.system(size: 14)).foregroundColor(AppColors.text_secondary)
}
```

---

## Toast

轻量级提示，从 Rust 逻辑中通过系统 API 调用，不在 AE 文件中声明。

### 系统调用

```rust
sys_toast(
    message: String,    // 提示内容
    type: String,       // 类型：info / success / error / warning
    duration: f64,      // 显示时长（毫秒）
    position: String    // 位置：top / center / bottom
)
```

### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| message | str | Toast 文字内容 |
| type | enum | 样式类型：info / success / error / warning |
| duration | num | 显示时长（毫秒），默认 2000 |
| position | enum | 显示位置：top / center / bottom |

### Rust 调用示例

```rust
sys_toast("保存成功".to_string(), "success".to_string(), 2000.0, "bottom".to_string());
sys_toast("网络错误".to_string(), "error".to_string(), 3000.0, "center".to_string());
```

### SwiftUI 输出

```swift
// Toast 由 SystemUIDelegate 在 App 根层统一挂载
// 根据类型自动选择颜色和图标
```

---

## Dialog

对话框组件，支持两种使用方式：

1. **Schema 声明式** — 在 AE 中声明 `Dialog` 组件
2. **系统命令式** — 从 Rust 通过 API 调用

### Schema 属性

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| visible | bool | 是 | — | 是否可见 |
| variant | enum | 否 | alert | 变体：alert / confirm / prompt |
| title | str | 是 | — | 标题 |
| message | str | 否 | — | 内容信息 |
| confirmText | str | 否 | "确认" | 确认按钮文字 |
| cancelText | str | 否 | "取消" | 取消按钮文字 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onConfirm | `() => void` | 点击确认 |
| onCancel | `() => void` | 点击取消 |

### 系统调用

```rust
// 显示对话框
sys_dialog_show(
    title: String,       // 标题
    message: String,     // 消息
    variant: String,     // alert / confirm / prompt
    confirm_text: String,// 确认按钮文字
    cancel_text: String  // 取消按钮文字
)

// 隐藏对话框
sys_dialog_hide()
```

### Rust 调用示例

```rust
// 提示框
sys_dialog_show("提示".to_string(), "操作已完成".to_string(), "alert".to_string(), "知道了".to_string(), "".to_string());

// 确认框
sys_dialog_show("确认删除".to_string(), "此操作不可恢复".to_string(), "confirm".to_string(), "删除".to_string(), "取消".to_string());
```

---

## ActionSheet

操作表组件，从底部弹出操作选项。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| visible | bool | 是 | — | 是否可见 |
| title | str | 否 | — | 标题 |
| message | str | 否 | — | 描述信息 |
| actions | str | 否 | — | 操作项列表 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onCancel | `() => void` | 取消/关闭 |

不支持子组件。

### AE 示例

```ae
ActionSheet(visible={Home.show_sheet} title="操作" actions="删除,编辑,分享")
```

### SwiftUI 输出

```swift
.confirmationDialog("操作", isPresented: $viewModel.showSheet, titleVisibility: .visible) {
    Button("删除", role: .destructive) { /* ... */ }
    Button("编辑") { /* ... */ }
    Button("分享") { /* ... */ }
    Button("取消", role: .cancel) { /* ... */ }
}
```

---

## Snackbar

底部提示条，支持操作按钮。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| visible | bool | 是 | — | 是否可见 |
| message | str | 是 | — | 提示信息 |
| action | str | 否 | — | 操作按钮文字 |
| duration | num | 否 | 4000 | 显示时长（毫秒） |

| 事件 | 签名 | 说明 |
|------|------|------|
| onAction | `() => void` | 操作按钮点击 |

不支持子组件。

### AE 示例

```ae
Snackbar(visible={Home.show_snack} message="文件已删除" action="撤销" duration=4000)
```

---

## Modal

模态弹窗，覆盖当前页面。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| visible | bool | 是 | — | 是否可见 |
| animationType | enum | 否 | fade | 动画类型：fade / slide / scale |
| position | enum | 否 | center | 位置：center / bottom / full |
| dismissible | bool | 否 | true | 点击遮罩是否关闭 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onClose | `() => void` | 关闭回调 |

继承 `_style`。支持子组件。

### AE 示例

```ae
Modal(visible={Home.show_modal} position="center" animationType="fade") {
    VStack(spacing=16) {
        Text("确认操作" size=18 weight="bold")
        Text("此操作不可撤销" size=14 color="$colors.text_secondary")
        HStack(spacing=12) {
            Button("取消" onClick={Home.close_modal()})
            Button("确认" onClick={Home.confirm()})
        }
    }
    .pad(24)
}
```

### SwiftUI 输出

```swift
if viewModel.showModal {
    ZStack {
        Color.black.opacity(0.4)
            .onTapGesture { if dismissible { viewModel.showModal = false } }
        VStack(spacing: 16) {
            Text("确认操作").font(.system(size: 18)).bold()
            Text("此操作不可撤销").font(.system(size: 14)).foregroundColor(AppColors.text_secondary)
            HStack(spacing: 12) {
                Button("取消") { viewModel.closeModal() }
                Button("确认") { viewModel.confirm() }
            }
        }
        .padding(24)
    }
    .transition(.opacity)
    .animation(.easeInOut(duration: 0.3), value: viewModel.showModal)
}
```

---

## BottomSheet

底部抽屉，从底部滑出的面板。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| visible | bool | 是 | — | 是否可见 |
| title | str | 否 | — | 标题 |
| height | num | 否 | — | 面板高度 |
| dismissible | bool | 否 | true | 点击遮罩是否关闭 |

| 事件 | 签名 | 说明 |
|------|------|------|
| onClose | `() => void` | 关闭回调 |

继承 `_style`。支持子组件。

### AE 示例

```ae
BottomSheet(visible={Home.show_sheet} title="筛选" height=400) {
    VStack(spacing=12) {
        Text("按类型筛选" size=14)
        // 筛选选项...
    }
}
```

---

## Popup

弹出层，锚定到某个元素。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| visible | bool | 是 | — | 是否可见 |
| anchor | str | 否 | — | 锚点元素 ID |
| position | enum | 否 | bottom | 弹出方向：top / bottom / left / right |

| 事件 | 签名 | 说明 |
|------|------|------|
| onClose | `() => void` | 关闭回调 |

继承 `_style`。支持子组件。

### AE 示例

```ae
Popup(visible={Home.show_popup} anchor="menu_btn" position="bottom") {
    VStack(spacing=8) {
        Text("新建文件")
        Text("打开文件")
        Text("保存")
    }
    .pad(8)
}
```

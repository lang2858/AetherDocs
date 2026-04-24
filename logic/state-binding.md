# 状态绑定

Aether 通过统一的绑定语法，将 AE 模板中的状态引用自动转换为 Swift 代码中的方法调用。本页涵盖所有状态绑定模式。

## Getter 绑定

在 AE 模板中，`{TypeName.field}` 引用会转换为 Swift 中对应的 getter 调用。

**AE 语法**：`{TypeName.field}` → Swift：`viewModel.logic.getXxx()`

**示例**：

```ae
Text("{Home.count}" size=14)
```

生成 Swift：

```swift
Text("\(viewModel.logic.getCount())")
```

## Setter 绑定

Setter 方法由构建系统从以 `set_` 开头的 `&mut self` 方法自动识别生成。

**生成模式**：

```swift
func setXxx(_ value: String) {
    logic.setXxx(value: value)
}
```

Setter 通常不直接在模板中使用，而是由 Action 方法内部调用或通过系统逻辑间接触发。

## Action 绑定

Action 绑定将用户交互事件连接到 Rust 逻辑方法。

**AE 语法**：`onClick={TypeName.method()}` → Swift：`viewModel.methodName()`

**示例**：

```ae
Button("Click" onClick={Home.on_click()})
```

生成 Swift：

```swift
Button(action: { viewModel.onClick() }) {
    Text("Click")
}.fixedSize()
```

方法名转换规则：Rust 中的 `on_click` 自动映射为 Swift 的 `onClick`（snake_case → camelCase）。

## 选中状态（Selected State）

Button 组件支持 `selected` 属性，根据绑定状态自动切换样式。

**AE 语法**：

```ae
Button("Tab" onClick={Home.switch_tab()} selected={Home.get_is_active()} selectedStyle="highlight")
```

### 选中样式

| 样式名 | 效果 | 适用场景 |
|---|---|---|
| `highlight`（默认） | 强调色背景填充 | Tab 选中、活跃指示 |
| `outline` | 边框描边 | 边框风格的选择器 |
| `invert` | 强调色填充 + 白色文字 | 对比强烈的选中态 |

- **highlight**：选中时按钮背景变为 accent color，未选中时保持默认背景。
- **outline**：选中时按钮显示 accent color 边框，未选中时无边框。
- **invert**：选中时按钮使用 accent color 填充且文字变白，未选中时为默认样式。

## 系统 UI 绑定

Rust 逻辑中可以直接调用系统 UI 功能，无需在 AE 模板中额外声明。

| API | 说明 | 使用场景 |
|---|---|---|
| `sys_toast(message, type, duration, position)` | 显示 Toast 提示 | 操作反馈、信息提示 |
| `sys_dialog_show(title, message, variant, ...)` | 显示对话框 | 确认操作、输入提示 |
| `sys_dialog_hide()` | 隐藏对话框 | 关闭对话框 |

调用示例：

```rust
pub fn delete_item(&mut self) {
    sys_toast("已删除".to_string(), "success".to_string(), 2.0, "bottom".to_string());
}
```

## 导航绑定

导航相关 API 允许从 Rust 逻辑中控制页面跳转。

| API | 说明 |
|---|---|
| `sys_navigate(route)` | 导航到指定路由 |
| `sys_go_back()` | 返回上一页 |
| `sys_navigate_with(route, params)` | 携带参数导航 |
| `sys_route_params()` | 获取所有路由参数 |
| `sys_route_param(key)` | 获取指定路由参数 |

## 路由参数示例

页面初始化时从路由参数中读取数据：

```rust
pub struct Detail {
    id: i32,
}

impl Detail {
    pub fn new() -> Self {
        let id: i32 = sys_route_param("id".to_string())
            .and_then(|v| v.parse().ok())
            .unwrap_or(0);
        let _ = sys_route_params(); // 消费剩余参数
        Self { id }
    }
}
```

**要点**：

- `sys_route_param(key)` 返回 `Option<String>`，需要手动解析为目标类型。
- `sys_route_params()` 返回所有参数的 `HashMap`，调用后会消费参数，避免重复读取。
- 通常在 `new()` 构造函数中一次性读取所有需要的参数。

## 绑定模式总结

| 绑定类型 | AE 语法 | Swift 生成 | 触发方式 |
|---|---|---|---|
| Getter | `{Type.field}` | `logic.getXxx()` | 自动（状态读取） |
| Setter | （内部调用） | `logic.setXxx(value:)` | 逻辑内部 |
| Action | `onClick={Type.method()}` | `viewModel.method()` | 用户交互 |
| Selected | `selected={Type.get_xxx()}` | 绑定到 getter | 状态驱动 |
| 系统 UI | Rust 函数调用 | 原生平台 API | 逻辑触发 |
| 导航 | Rust 函数调用 | 原生导航 API | 逻辑触发 |

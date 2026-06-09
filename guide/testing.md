# 测试框架

Aether 提供了内置的黑盒测试框架，让你可以用 Rust 脚本对 Web 平台上的应用进行端到端测试。

## 概念

测试框架由三部分组成：

1. **测试运行器** (`aether-test` crate) — Rust API，提供定位、操作、断言能力
2. **浏览器代理** (`test-agent.js`) — 注入到页面中的 JS，执行 DOM 操作并返回结果
3. **`data-ae-*` 属性** — 代码生成阶段自动注入到 HTML 元素上，用于组件定位

通信流程：

```
Rust 测试脚本  ──WebSocket──▶  test-agent.js (浏览器内)
                                ↓
                          DOM 操作 / 状态读取
                                ↓
Rust 测试脚本  ◀──JSON────  操作结果 / 渲染树快照
```

## 快速开始

### 1. 启动开发服务器

```bash
aether dev start
```

开发服务器会自动：
- 在 HTML 页面中注入 `data-ae-type`、`data-ae-name`、`data-ae-uid` 属性
- 加载 `test-agent.js` 并开放 WebSocket 端口

启动后服务器会输出端口信息，例如：

```
dev server: http://localhost:3000
test ws: ws://localhost:3001/aether-test
```

也可以指定端口：

```bash
# 自定义 HTTP 端口和 WebSocket 测试端口
aether dev start --port 8080 --test-port 3001
```

### 2. 创建测试文件

在项目 `src/tests/` 目录下创建 `.rs` 测试文件：

```bash
mkdir -p src/tests
```

编写测试：

```rust
// src/tests/login.rs
use aether_test::prelude::*;

#[tokio::test]
async fn test_login_flow() {
    let config = TestConfig::default();
    let mut runner = TestRunner::new(config).await.unwrap();

    // 导航到登录页
    runner.navigate("/login").await.unwrap();

    // 等待页面加载
    runner.wait_for(TextField("username"), None).await.unwrap();

    // 输入凭据
    runner.type_text(TextField("username"), "admin").await.unwrap();
    runner.type_text(TextField("password"), "secret").await.unwrap();

    // 点击登录
    runner.click(Button("login")).await.unwrap();

    // 验证跳转到首页
    runner.assert_visible(Text("欢迎回来")).await.unwrap();
}
```

::: tip 端口自动注入
`aether test` 命令会自动生成 `make_config()` 函数，将开发服务器的端口信息注入到 `TestConfig` 中。测试文件中的 `TestConfig::default()` 会被自动替换为 `make_config()`，无需手动配置端口。
:::

### 3. 运行测试

```bash
# 通过端口连接已运行的 dev server
aether test --port 3000

# 指定报告格式
aether test --port 3000 --report html,json,junit

# 过滤测试文件
aether test --port 3000 -f login
```

## 定位器

定位器（Locator）是测试框架的核心概念，用于在渲染树中找到目标组件。

### 构造方式

```rust
use aether_test::locator::*;

// 按组件类型 + name 属性定位（最常用）
Button("submit")        // → [data-ae-type="Button"][data-ae-name="submit"]
TextField("email")      // → [data-ae-type="TextField"][data-ae-name="email"]
Toggle("dark_mode")     // → [data-ae-type="Toggle"][data-ae-name="dark_mode"]

// 按组件类型 + 文本内容定位
Text("Hello")           // → 类型为 Text 且文本包含 "Hello" 的元素

// 按组件类型定位
Locator::by_type("VStack")  // → 任意 VStack

// 按 data-ae-id 定位（稳定，不受 UI 变化影响）
Locator::by_id("pages/home:Button:42")

// 按源码位置定位
Locator::by_type_line("Button", 42, "pages/home")

// 按 CSS 选择器定位
Locator::by_css(".my-custom-class")
```

### 作用域定位

使用 `.within()` 在父容器内查找子元素，避免同名冲突：

```rust
// 在 VStack("row-1") 内查找 Button("delete")
let locator = Locator::by_name("Button", "delete")
    .within(Locator::by_name("VStack", "row-1"));
runner.click(locator).await?;
```

### 索引定位

使用 `.nth()` 选择第 N 个匹配的元素（0-indexed）：

```rust
// 点击第二个 Button
runner.click(Locator::by_type("Button").nth(1)).await?;
```

### 内置定位器函数

| 函数 | 对应组件 |
|------|---------|
| `Button(name)` | Button |
| `TextField(name)` | TextField |
| `TextArea(name)` | TextArea |
| `Text(text)` | Text（按文本内容） |
| `Toggle(name)` | Toggle |
| `Checkbox(name)` | Checkbox |
| `Select(name)` | Select |
| `Slider(name)` | Slider |
| `IconButton(name)` | IconButton |
| `SearchBar(name)` | SearchBar |
| `Icon(name)` | Icon |
| `Image(name)` | Image |
| `VStack(name)` | VStack |
| `HStack(name)` | HStack |
| `ZStack(name)` | ZStack |
| `ScrollView(name)` | ScrollView |
| `Modal(name)` | Modal |
| `Popover(name)` | Popover |
| `SplitView(name)` | SplitView |
| `Toolbar(name)` | Toolbar |
| `Rectangle(name)` | Rectangle |

### name 属性

定位器依赖 AE 组件的 `name` 属性。在 `.ae` 文件中声明：

```ae
VStack(name="main") {
    TextField(name="email", placeholder="输入邮箱") {
        ...
    }
    Button(name="submit", title="提交") {
        ...
    }
}
```

::: tip 最佳实践
为需要测试交互的组件添加 `name` 属性。纯布局容器（如 VStack/HStack）通常不需要。
:::

## 操作 API

### 导航

```rust
// 路由导航
runner.navigate("/home").await?;

// 浏览器前进/后退
runner.go_back().await?;
runner.go_forward().await?;
```

### 点击

```rust
// 单击
runner.click(Button("submit")).await?;

// 双击
runner.double_click(Text("title")).await?;

// 右键（上下文菜单）
runner.right_click(Image("photo")).await?;

// 悬停
runner.hover(MenuItem("file")).await?;
```

### 输入与表单

```rust
// 输入文本
runner.type_text(TextField("email"), "user@example.com").await?;

// 勾选/取消勾选
runner.check(Toggle("notifications"), true).await?;
runner.check(Checkbox("agree"), false).await?;

// 下拉选择
runner.select_option(Select("country"), "CN").await?;

// 上传文件
runner.upload_file(
    Locator::by_name("input", "avatar"),
    vec![serde_json::json!({"name": "photo.png", "type": "image/png"})],
).await?;

// 拖拽
runner.drag(
    Locator::by_name("Card", "item-1"),
    Locator::by_name("VStack", "column-2"),
).await?;
```

### 键盘

```rust
// 按键（Enter、Escape、Tab 等）
runner.press_key("Enter").await?;
runner.press_key("Escape").await?;
runner.press_key("Tab").await?;

// 组合键（Ctrl+C、Ctrl+S 等）
runner.press_key_with_modifiers("c", true, false, false, false).await?;  // Ctrl+C
runner.press_key_with_modifiers("s", true, false, false, false).await?;  // Ctrl+S

// 逐字符输入（模拟真实键盘输入）
runner.type_keys("Hello World").await?;
```

### 焦点

```rust
// 聚焦元素
runner.focus(TextField("search")).await?;

// 失焦
runner.blur(TextField("search")).await?;
```

### 滚动

```rust
// 滚动到可见区域
runner.scroll_into_view(Button("load_more")).await?;
```

### 等待

```rust
// 等待元素出现（使用默认超时 5s）
runner.wait_for(Text("加载完成"), None).await?;

// 自定义超时
runner.wait_for(Button("submit"), Some(10000)).await?;

// 等待网络空闲（无 pending 请求）
runner.wait_for_network_idle(None).await?;
runner.wait_for_network_idle(Some(30000)).await?;  // 30s 超时

// 等待 URL 变化
runner.wait_for_url("/dashboard", None).await?;
```

### 视口与响应式

```rust
use aether_test::prelude::ViewportSize;

// 设置自定义视口大小
runner.set_viewport(375, 812).await?;

// 使用预设视口
runner.set_viewport_preset(ViewportSize::mobile()).await?;    // 375×812
runner.set_viewport_preset(ViewportSize::tablet()).await?;    // 768×1024
runner.set_viewport_preset(ViewportSize::desktop()).await?;   // 1440×900

runner.assert_visible(VStack("mobile-nav")).await?;
runner.assert_hidden(HStack("desktop-nav")).await?;
```

### 截图

```rust
// 截图并保存到文件
let path = runner.take_screenshot("login_page").await?;
println!("Screenshot saved to: {}", path);
```

::: tip 自动截图
`TestConfig` 默认启用 `screenshot_on_failure`，测试失败时自动截图保存到 `test-reports/screenshots/`。
:::

### 对话框

```rust
// 获取对话框文本
let text = runner.get_dialog_text().await?;

// 接受对话框
runner.accept_dialog(None).await?;
runner.accept_dialog(Some("yes")).await?;  // 对 prompt 输入响应

// 关闭对话框
runner.dismiss_dialog().await?;
```

### 网络拦截与 Mock

```rust
// 拦截匹配 URL 模式的请求
let intercept_id = runner.intercept_requests("/api/").await?;

// Mock 响应
runner.mock_response(
    &intercept_id,
    "/api/users",
    200,
    r#"[{"id": 1, "name": "Alice"}]"#,
).await?;

// 执行触发请求的操作...
runner.click(Button("load_users")).await?;

// 获取拦截到的请求记录
let requests = runner.get_intercepted_requests(&intercept_id).await?;
for req in &requests {
    println!("{} {}", req["method"], req["url"]);
}
```

### JavaScript 执行

```rust
// 在浏览器中执行 JS 表达式
let result = runner.evaluate("document.querySelectorAll('[data-ae-type]').length").await?;
println!("Component count: {:?}", result);
```

## 断言 API

### 可见性断言

```rust
// 断言组件可见
runner.assert_visible(Button("submit")).await?;

// 断言组件隐藏
runner.assert_hidden(Button("delete")).await?;

// 断言组件不存在于 DOM 中
runner.assert_not_exists(Button("legacy_btn")).await?;
```

### 文本断言

```rust
// 精确匹配文本
runner.assert_text(Text("greeting"), "Hello, Admin").await?;

// 包含文本
runner.assert_contains_text(Text("status"), "在线").await?;
```

### 数量断言

```rust
// 断言某类型组件的数量
runner.assert_count("Button", 3).await?;
```

### 状态断言

```rust
// 断言 WASM 状态值（需要 __aether_state 桥接）
runner.assert_state("AppState", "counter", json!(42)).await?;
```

### 值断言

```rust
// 断言输入框的值
runner.assert_value(TextField("email"), "user@example.com").await?;
```

### 样式断言

```rust
// 断言计算后的 CSS 属性值
runner.assert_style(Text("title"), "font-size", "24px").await?;
runner.assert_style(Button("submit"), "background-color", "rgb(0, 122, 255)").await?;
```

### 布局断言

```rust
use aether_test::prelude::RectExpect;

// 断言元素位置和尺寸
runner.assert_rect(Button("submit"),
    RectExpect::size(120.0, 40.0)
).await?;

// 断言位置
runner.assert_rect(Button("submit"),
    RectExpect::pos(100.0, 200.0)
).await?;

// 组合断言
runner.assert_rect(Button("submit"),
    RectExpect::new()
        .with_width(120.0)
        .with_height(40.0)
).await?;
```

### 属性断言

```rust
// 断言元素属性值
runner.assert_attribute(TextField("email"), "placeholder", "输入邮箱").await?;
```

### 启用/禁用断言

```rust
// 断言元素可用
runner.assert_enabled(Button("submit")).await?;

// 断言元素禁用
runner.assert_disabled(Button("submit")).await?;
```

### 焦点断言

```rust
// 断言元素获得焦点
runner.assert_focused(TextField("search")).await?;
```

### URL 断言

```rust
// 断言当前页面 URL/路由
runner.assert_url("/dashboard").await?;
```

### 可访问性断言

```rust
// 检查页面可访问性（ARIA 标签、alt 文本等）
runner.assert_accessible(None).await?;

// 检查特定元素的可访问性
runner.assert_accessible(Some(VStack("form"))).await?;

// 获取可访问性树
let tree = runner.get_accessibility_tree(None).await?;
```

## 渲染树快照

获取当前页面的完整渲染树，用于调试或自定义断言：

```rust
let tree = runner.render_tree().await?;

for node in &tree {
    println!("{}: type={:?} name={:?}", node.tag, node.ae_type, node.name);
    for child in &node.children {
        // 递归遍历...
    }
}
```

渲染树节点结构：

```rust
struct RenderNode {
    tag: String,              // HTML 标签名
    ae_type: Option<String>,  // AE 组件类型（来自 data-ae-type）
    name: Option<String>,     // name 属性（来自 data-ae-name）
    uid: Option<String>,      // 唯一标识（来自 data-ae-uid，仅 dev 模式）
    text: Option<String>,     // 直接文本内容
    attrs: Value,             // 其他属性
    children: Vec<RenderNode>,// 子节点
}
```

## 自动检查

框架内置 `auto_check` 功能，自动遍历页面上所有组件并验证：

1. **可见性** — 零尺寸元素标记为 broken
2. **内容** — 内容依赖型组件（Button、Icon 等）检查是否有渲染内容
3. **样式正确性** — 对比 `data-ae-styles`（期望值）与 computed CSS（实际值）
4. **条件可见性** — `data-if` / `--visible` 绑定检查是否与实际状态一致
5. **异常宽度** — 检测不应全宽但渲染为父元素宽度的组件
6. **未绑定表达式** — 检测 `{State.field}` 形式的未解析绑定

```rust
let report = runner.auto_check().await?;
println!("检查 {} 个组件，{} 个问题", report.total, report.issues.len());
```

## 生命周期钩子

在测试前后执行通用逻辑（如导航、状态重置）：

```rust
let mut runner = TestRunner::new(config).await?;

// 每个测试前执行
runner.set_before_each(|runner| {
    // 注意：before_each 是同步的，异步操作需在测试内手动执行
});

// 每个测试后执行（参数为 pass/fail）
runner.set_after_each(|runner, passed| {
    if !passed {
        // 测试失败时的处理
    }
});
```

## TestConfig 配置

`TestConfig` 控制测试运行器的行为：

```rust
pub struct TestConfig {
    pub project_dir: PathBuf,         // 项目路径
    pub platform: String,             // 测试平台（目前仅支持 "web"）
    pub dev_port: u16,                // 开发服务器 HTTP 端口
    pub test_port: u16,               // WebSocket 测试端口
    pub timeout_ms: u64,              // 默认等待超时（毫秒）
    pub output_dir: String,           // 报告输出目录
    pub report_formats: Vec<String>,  // 报告格式
    pub auto_submit_bug: bool,        // 失败时自动提交 bug 工单
    pub record_replay: bool,          // 记录操作回放数据
    pub retry_count: u32,             // 失败重试次数
    pub screenshot_on_failure: bool,  // 失败时自动截图
    pub screenshot_dir: Option<String>, // 截图保存目录
}
```

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `project_dir` | `"."` | 项目路径 |
| `platform` | `"web"` | 测试平台 |
| `dev_port` | `0` | 开发服务器端口（由 `aether test` 自动注入） |
| `test_port` | `0` | WebSocket 测试端口（由 `aether test` 自动注入） |
| `timeout_ms` | `5000` | 默认等待超时（毫秒） |
| `output_dir` | `"test-reports"` | 报告输出目录 |
| `report_formats` | `["html", "json"]` | 报告格式 |
| `auto_submit_bug` | `false` | 失败时自动提交 bug 工单 |
| `record_replay` | `true` | 记录操作回放数据 |
| `retry_count` | `0` | 失败重试次数 |
| `screenshot_on_failure` | `true` | 失败时自动截图 |
| `screenshot_dir` | `None` | 截图目录（默认 `output_dir/screenshots`） |

::: warning 端口配置方式
`dev_port` 和 `test_port` 不需要手动设置。`aether test` 命令通过 `--port` 参数连接开发服务器，自动获取端口信息并注入到 `TestConfig` 中。测试文件中写 `TestConfig::default()` 即可，CLI 会在运行时自动替换为带有正确端口信息的 `make_config()`。
:::

## 协议类型

### ViewportSize

```rust
use aether_test::prelude::ViewportSize;

ViewportSize::mobile()         // 375×812
ViewportSize::tablet()         // 768×1024
ViewportSize::desktop()        // 1440×900
ViewportSize::custom(w, h)     // 自定义尺寸
```

### A11yNode

可访问性树节点，包含 ARIA 角色、标签、焦点和禁用状态：

```rust
struct A11yNode {
    role: Option<String>,
    label: Option<String>,
    tag: String,
    name: Option<String>,
    focusable: bool,
    disabled: bool,
    visible: bool,
    children: Vec<A11yNode>,
}
```

### DialogInfo

原生对话框信息：

```rust
struct DialogInfo {
    dialog_type: String,   // "alert" | "confirm" | "prompt"
    message: String,
}
```

## 报告

测试完成后自动生成报告：

### HTML 报告

包含通过/失败统计、步骤详情、错误信息。支持按状态筛选和搜索。

输出文件：`test-reports/index.html`

### JUnit XML

标准 JUnit 格式，适合 CI/CD 集成。

输出文件：`test-reports/junit.xml`

### JSON

原始测试数据，方便自定义处理。

输出文件：`test-reports/results.json`

## 命令行

### aether dev start

```bash
aether dev start [选项]

选项:
  -p, --project <PATH>      项目路径 [默认: .]
      --port <PORT>         HTTP 服务端口 [默认: 0 (动态分配)]
      --test-port <PORT>    WebSocket 测试端口 [默认: 3001]
      --no-open             不自动打开浏览器
```

### aether test

```bash
aether test [选项]

选项:
  -p, --project <PATH>      项目路径 [默认: .]
      --port <PORT>         开发服务器端口（用于连接已运行的 dev server）
  -f, --filter <PATTERN>    测试文件过滤 (substring match)
      --report <FORMATS>    报告格式: html,json,junit [默认: html,json]
      --no-browser          不启动浏览器
      --watch               监视模式
```

::: tip 工作流程
1. 先启动 dev server：`aether dev start`
2. 记下输出的端口（如 `http://localhost:3000`）
3. 用相同端口运行测试：`aether test --port 3000`
:::

## data-ae-* 属性

代码生成阶段自动在 HTML 元素上注入测试属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| `data-ae-type` | AE 组件类型 | `"Button"`, `"VStack"`, `"Text"` |
| `data-ae-name` | name 属性值 | `"submit"`, `"email"` |
| `data-ae-uid` | 唯一标识 | `"view_0_section_2"` |
| `data-ae-styles` | 期望样式（auto_check 用） | `{"background-color":"#FF0000"}` |
| `data-ae-loc` | 源码位置 | `"pages/home.ae:42"` |

属性注入规则：
- **开发/测试模式**：注入全部属性
- **生产模式**：仅注入 `data-ae-type`（最小体积影响）

## 完整示例

```rust
// src/tests/todo.rs
use aether_test::prelude::*;
use aether_test::locator::*;

#[tokio::test]
async fn test_todo_app() {
    let config = TestConfig::default();
    let mut runner = TestRunner::new(config).await.unwrap();

    // 1. 打开待办页面
    runner.navigate("/").await.unwrap();
    runner.wait_for(TextField("new_todo"), None).await.unwrap();

    // 2. 添加待办事项
    runner.type_text(TextField("new_todo"), "写测试用例").await.unwrap();
    runner.press_key("Enter").await.unwrap();

    // 3. 验证新增项出现
    runner.assert_visible(Text("写测试用例")).await.unwrap();
    runner.assert_count("ListItem", 1).await.unwrap();

    // 4. 完成待办
    runner.click(Checkbox("todo_0")).await.unwrap();

    // 5. 验证状态变化
    runner.assert_state("TodoState", "completed_count", json!(1)).await.unwrap();

    // 6. 响应式测试
    runner.set_viewport_preset(ViewportSize::mobile()).await.unwrap();
    runner.assert_visible(VStack("mobile_nav")).await.unwrap();

    // 7. 截图
    runner.take_screenshot("todo_mobile").await.unwrap();

    // 8. 可访问性检查
    runner.assert_accessible(None).await.unwrap();

    // 9. 删除待办
    runner.set_viewport_preset(ViewportSize::desktop()).await.unwrap();
    runner.click(Button("delete_0")).await.unwrap();
    runner.assert_count("ListItem", 0).await.unwrap();

    // 10. URL 断言
    runner.assert_url("/").await.unwrap();

    // 11. 返回
    runner.go_back().await.unwrap();
}
```

运行：

```bash
aether dev start --port 3000
aether test --port 3000 -f todo
```

## API 总览

### 操作方法

| 方法 | 说明 |
|------|------|
| `navigate(route)` | 导航到路由 |
| `go_back()` | 浏览器后退 |
| `go_forward()` | 浏览器前进 |
| `click(locator)` | 单击 |
| `double_click(locator)` | 双击 |
| `right_click(locator)` | 右键点击 |
| `hover(locator)` | 悬停 |
| `type_text(locator, text)` | 输入文本 |
| `press_key(key)` | 按键 |
| `press_key_with_modifiers(key, ctrl, alt, shift, meta)` | 组合键 |
| `type_keys(keys)` | 逐字符输入 |
| `check(locator, checked)` | 勾选/取消 |
| `select_option(locator, value)` | 下拉选择 |
| `drag(source, target)` | 拖拽 |
| `upload_file(locator, files)` | 上传文件 |
| `focus(locator)` | 聚焦 |
| `blur(locator)` | 失焦 |
| `scroll_into_view(locator)` | 滚动到可见 |
| `set_viewport(w, h)` | 设置视口 |
| `set_viewport_preset(preset)` | 预设视口 |
| `take_screenshot(name)` | 截图 |
| `dismiss_dialog()` | 关闭对话框 |
| `accept_dialog(response)` | 接受对话框 |
| `get_dialog_text()` | 获取对话框文本 |
| `intercept_requests(pattern)` | 拦截网络请求 |
| `mock_response(id, url, status, body)` | Mock 响应 |
| `get_intercepted_requests(id)` | 获取拦截记录 |
| `evaluate(expression)` | 执行 JS |

### 等待方法

| 方法 | 说明 |
|------|------|
| `wait_for(locator, timeout)` | 等待元素出现 |
| `wait_for_network_idle(timeout)` | 等待网络空闲 |
| `wait_for_url(url, timeout)` | 等待 URL 变化 |

### 断言方法

| 方法 | 说明 |
|------|------|
| `assert_visible(locator)` | 断言可见 |
| `assert_hidden(locator)` | 断言隐藏 |
| `assert_not_exists(locator)` | 断言不存在 |
| `assert_text(locator, expected)` | 精确文本匹配 |
| `assert_contains_text(locator, expected)` | 包含文本 |
| `assert_count(ae_type, expected)` | 组件数量 |
| `assert_state(type, field, expected)` | 状态值 |
| `assert_value(locator, expected)` | 输入框值 |
| `assert_style(locator, property, expected)` | CSS 属性 |
| `assert_rect(locator, expected)` | 位置和尺寸 |
| `assert_attribute(locator, attr, expected)` | HTML 属性 |
| `assert_enabled(locator)` | 断言可用 |
| `assert_disabled(locator)` | 断言禁用 |
| `assert_focused(locator)` | 断言获焦 |
| `assert_url(expected)` | 断言 URL |
| `assert_accessible(locator)` | 可访问性检查 |
| `auto_check()` | 自动视觉检查 |

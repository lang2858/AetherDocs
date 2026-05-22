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

### 1. 启动开发服务器（测试模式）

```bash
aether dev start
```

开发服务器会自动：
- 在 HTML 页面中注入 `data-ae-type`、`data-ae-name`、`data-ae-uid` 属性
- 加载 `test-agent.js` 并开放 WebSocket 端口

### 2. 添加测试依赖

在你的项目 `Cargo.toml` 中：

```toml
[dev-dependencies]
aether-test = { path = "<aether-source>/source/crates/aether-test" }
tokio = { version = "1", features = ["full"] }
```

### 3. 编写第一个测试

```rust
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

### 4. 运行测试

```bash
# 使用 cargo test
cargo test

# 或使用 aether test 命令
aether test --project . --report html,json
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
| `Icon(name)` | Icon |
| `Image(name)` | Image |
| `VStack(name)` | VStack |
| `HStack(name)` | HStack |
| `ZStack(name)` | ZStack |
| `ScrollView(name)` | ScrollView |

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
```

### 交互

```rust
// 点击
runner.click(Button("submit")).await?;

// 输入文本
runner.type_text(TextField("email"), "user@example.com").await?;

// 勾选/取消勾选
runner.check(Toggle("notifications"), true).await?;
runner.check(Checkbox("agree"), false).await?;

// 滚动到可见区域
runner.scroll_into_view(Button("load_more")).await?;
```

### 等待

```rust
// 等待元素出现（使用默认超时 5s）
runner.wait_for(Text("加载完成"), None).await?;

// 自定义超时
runner.wait_for(Button("submit"), Some(10000)).await?;
```

## 断言 API

### 可见性断言

```rust
// 断言组件可见
runner.assert_visible(Button("submit")).await?;

// 断言组件隐藏或不存在
runner.assert_hidden(Button("delete")).await?;
```

### 文本断言

```rust
// 断言组件文本内容
runner.assert_text(Text("greeting"), "Hello, Admin").await?;
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

## 配置

### aether-test.toml

在项目根目录创建 `aether-test.toml`：

```toml
platform = "web"
base_url = "http://localhost"
port = 3000
test_port = 3001
timeout_ms = 5000
output_dir = "test-reports"
report_formats = ["html", "json", "junit"]
auto_submit_bug = false
record_replay = true
```

### 配置项说明

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `platform` | `"web"` | 测试平台（目前仅支持 web） |
| `base_url` | `"http://localhost"` | 开发服务器地址 |
| `port` | `3000` | 开发服务器端口 |
| `test_port` | `3001` | 测试 WebSocket 端口 |
| `timeout_ms` | `5000` | 默认等待超时（毫秒） |
| `output_dir` | `"test-reports"` | 报告输出目录 |
| `report_formats` | `["html", "json"]` | 报告格式 |
| `auto_submit_bug` | `false` | 失败时自动提交 bug 工单 |
| `record_replay` | `true` | 记录操作回放数据 |

## 报告

测试完成后自动生成报告：

### HTML 报告

包含通过/失败统计、步骤详情、错误信息。

输出文件：`test-reports/index.html`

### JUnit XML

标准 JUnit 格式，适合 CI/CD 集成。

输出文件：`test-reports/junit.xml`

### JSON

原始测试数据，方便自定义处理。

输出文件：`test-reports/results.json`

## 命令行

```bash
aether test [选项]

选项:
  -p, --project <PATH>      项目路径 [默认: .]
  -f, --filter <PATTERN>    测试文件过滤 (glob)
  --report <FORMATS>        报告格式: html,json,junit [默认: html,json]
  --no-browser              不启动浏览器
  --watch                   监视模式
```

## data-ae-* 属性

代码生成阶段自动在 HTML 元素上注入测试属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| `data-ae-type` | AE 组件类型 | `"Button"`, `"VStack"`, `"Text"` |
| `data-ae-name` | name 属性值 | `"submit"`, `"email"` |
| `data-ae-uid` | 唯一标识 | `"view_0_section_2"` |

属性注入规则：
- **开发/测试模式**：注入全部三个属性
- **生产模式**：仅注入 `data-ae-type`（最小体积影响）

## 完整示例

```rust
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
    runner.click(Button("add")).await.unwrap();

    // 3. 验证新增项出现
    runner.assert_visible(Text("写测试用例")).await.unwrap();
    runner.assert_count("ListItem", 1).await.unwrap();

    // 4. 完成待办
    runner.click(Checkbox("todo_0")).await.unwrap();

    // 5. 验证状态变化
    runner.assert_state("TodoState", "completed_count", json!(1)).await.unwrap();

    // 6. 删除待办
    runner.click(Button("delete_0")).await.unwrap();
    runner.assert_count("ListItem", 0).await.unwrap();
}
```

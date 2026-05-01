# 常见问题与避坑指南

---

## Rust 代码编写

### Q: 构造器可以有参数吗？

**当前不支持**。构造器必须是 `pub fn new() -> Self`。如果需要初始化参数，使用静态方法模式：

```rust
pub fn new() -> Self {
    Self { count: 0 }
}

pub fn with_count(count: i32) -> Self {
    Self { count }
}
```

### Q: 为什么翻译后方法体中 `self.field` 变成了 `inner.field`？

因为翻译器将 struct 字段包装在 `Mutex<NameInner>` 中，方法体中的 `self.field` 需要改为通过 `inner`（Mutex guard）访问。翻译器自动完成这个替换。

### Q: 方法体中使用 `self.inner` 会有问题吗？

**会**。翻译器会将所有 `self.` 替换为 `inner.`，导致 `self.inner` 变成 `inner.inner`。如果需要手动访问 inner，说明你已经在用 inner Mutex 模式，翻译器会跳过自动包装。

### Q: 为什么我写的 getter 没有生成 @Published 属性？

检查 getter 是否满足所有条件（见 [writing-rust.md](writing-rust.md) §6）：

1. 接收者必须是 `&self`（不是 `&mut self`）
2. 必须有返回值且不是 `()`
3. 方法名不能以 `on_` 开头
4. **不能有额外参数**（只有 `&self`）

常见错误：`pub fn get_file_content(&self, path: &str) -> String` — 有额外参数，不会被识别为 getter。

### Q: 自由函数如何暴露给 Swift？

模块级 `pub fn` 会被自动添加 `#[uniffi::export]`，暴露为 UniFFI 自由函数。在 Swift 侧，它们被关联到模块主 struct 的 Manager 上。

---

## 跨模块引用

### Q: `use crate::diff::DiffOp;` 编译报错 "unresolved import"

确保：
1. `diff.rs` 中 `DiffOp` 声明为 `pub`
2. 翻译器已生成 `lib.rs` 包含 `pub mod diff;` 和 `pub use diff::*;`
3. 重新运行 `aether trans` 后再编译

### Q: 能否引用 Aether 框架内部的类型？

不能。只能引用同项目 `src/logic/` 下的模块。

### Q: `use super::diff::DiffOp;` 能用吗？

**不推荐**。翻译器未做相对路径规范化，可能导致生成的代码中路径不正确。使用绝对路径 `use crate::diff::DiffOp;`。

---

## 外部依赖

### Q: extra_deps.toml 解析报错

常见原因：
1. 缺少 `[dependencies]` 段头
2. 依赖名包含非法字符（只允许字母、数字、`_`、`-`）
3. 试图覆盖 `uniffi` 依赖

### Q: 使用 serde_json 的类型出现在方法签名中，UniFFI 编译报错

这是 UniFFI orphan rule 限制。外部 crate 的类型不能直接跨 FFI 边界。

**解决方案**：
1. 将外部类型只在方法体内部使用，不出现在 pub 签名中
2. 如果必须暴露，使用 `custom_type!` 包装（见 [cross-module.md](cross-module.md) §3.3）

### Q: extra_deps.toml 中能指定 build-dependencies 吗？

当前不支持。`extra_deps.toml` 只处理 `[dependencies]` 段。`[build-dependencies]` 由 `native_deps.toml` 自动管理（bindgen）。

---

## C/C++ 桥接

### Q: native_deps.toml 中 bridge=c_abi 时需要写 headers 吗？

不需要。`c_abi` 路径自动生成桥接头 `aether_{name}_bridge.h`，但开发者需要提供 `aether_{name}_bridge.cpp` 实现。

### Q: bindgen 生成的 FFI 声明在哪里？

`logic/src/ffi/{name}.rs`，在 `cargo build` 时由 build.rs 调用 bindgen 自动生成。不要手动编辑。

### Q: C++ 库的 .dylib/.so 放在哪里？

放在 `src/logic/native/{platform}/` 目录下，并在 `native_deps.toml` 的 `platforms.{platform}.lib_path` 中声明路径。

### Q: framework 类型的库怎么配置？

```toml
[native_lib.platforms.macos]
lib_path = "native/macos/AudioEngine.framework"
framework = true
```

### Q: Android 多 ABI 怎么配置？

```toml
[native_lib.platforms.android]
lib_path = "native/android/{abi}/libvideo_lib.so"
abis = ["arm64-v8a", "armeabi-v7a", "x86_64"]
```

---

## 状态同步

### Q: 为什么 refreshFromRust 每次都读所有 getter？

这是当前的全量刷新策略，确保状态一致性。增量刷新只在推送通知时使用。对于字段较多的情况，考虑长期优化方案。

### Q: 推送通知的字段名用什么格式？

用 Swift 属性名（camelCase），不是 Rust getter 名：

- Rust getter: `get_active_content` → 推送: `"activeContent"`
- Rust getter: `open_files` → 推送: `"openFiles"`

### Q: 多个 View 可以订阅同一个 Manager 吗？

可以。Manager 是 `static let shared` 单例，所有 View 共享同一个实例。在 View 的 `onAppear` 中调用 `xxxManager.subscribeObserver()` 即可。

---

## 绑定

### Q: `{EditorState.activeFile}` 和 `{Editor.activeFile}` 有区别吗？

翻译器会将 `Editor` 和 `EditorState` 都路由到 `editorManager`。但建议使用简短名 `Editor`，这是惯例。

### Q: .click() 能传参数吗？

当前不支持。`.click(action=method)` 中的方法必须是无参的。需要参数时，用 TextField 绑定临时值 + 无参 click 模式。

### Q: 为什么 .click(action=openFile) 没有路由到正确的方法？

无前缀的 `.click()` 默认路由到 `editorManager`。如果方法在其他 Manager 上，使用 `TypeName.method` 格式显式指定：

```ae
.click(action=Home.on_click)
.click(action=Settings.switch_theme)
```

---

## 编译与调试

### Q: cargo build 报错 "undefined symbol"

常见原因：
1. C/C++ 库文件不存在或路径错误 — 检查 `native_deps.toml` 中 `lib_path` 对应的文件是否存在
2. 链接顺序错误 — 确保依赖库在被依赖库之前声明
3. ABI 不匹配 — 确保 Rust 编译架构与 C/C++ 库架构一致（如都是 arm64）

### Q: aether trans 后生成的 Swift 代码有编译错误

1. 确保先 `cargo build` 成功（Rust 编译通过）
2. 确保 UniFFI 绑定已生成（`aether build` 的第 3 步）
3. 检查是否有跨模块引用断裂或类型不匹配

### Q: 如何查看翻译器生成的中间代码？

- Rust 侧：查看 `gen/macos/logic/src/` 目录下的 `.rs` 文件
- Swift Manager：查看 `gen/macos/Sources/AppTarget/Managers/` 目录
- Swift View：查看 `gen/macos/Sources/AppTarget/Views/` 目录

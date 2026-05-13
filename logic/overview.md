# Logic 层开发指南

Aether 的 Logic 层是应用的状态与业务逻辑核心，基于 **Rust → UniFFI → 平台原生** 桥接架构。开发者只需编写普通的 Rust 代码（struct + impl + enum + fn），构建系统自动完成 UniFFI 桥接、Swift/Kotlin 绑定生成等所有工作。

## 架构流程

```
开发者编写纯 Rust 代码（struct + impl + enum + fn）
        ↓
aether trans 提取 Rust 模块信息（aether-codegen::rust_extractor）
        ↓
生成 UniFFI crate ← 自动包装 Mutex + #[uniffi::export]
        ↓
cargo build 编译 Rust → UniFFI bindgen 生成平台绑定
        ↓
平台原生代码 (SwiftUI/Compose) 通过绑定调用 Rust 逻辑
```

## 文档索引

| 文档 | 内容 | 何时阅读 |
|------|------|---------|
| [writing-rust.md](writing-rust.md) | Rust 代码编写规则：struct/enum/impl 写法、自动转换规则、方法分类、自由函数 | 开始写 .rs 文件前必读 |
| [state-sync.md](state-sync.md) | 状态同步机制：Manager 生成、Getter/Action 映射、双向绑定 | 需要理解平台如何读取 Rust 状态时 |
| [binding.md](binding.md) | .ae 绑定语法：`{TypeName.field}`、`{TypeName.method()}` 事件分发、TextField 双向绑定 | 写 .ae 文件与 Rust 交互时 |
| [cross-module.md](cross-module.md) | 跨模块引用、外部 crate 依赖、类型映射表 | 需要跨 .rs 文件引用类型或使用 serde 等外部库时 |
| [native-bridge.md](native-bridge.md) | C/C++ 原生库桥接：bindgen、modulemap、C ABI 桥接 | 需要集成 .so/.dylib/.a 等已有 C/C++ 库时 |
| [system-api.md](system-api.md) | 系统 API：Toast、Dialog、Navigation、Keyboard 等 | 需要在 Rust 中调用平台原生能力时 |
| [faq.md](faq.md) | 常见问题与踩坑指南 | 遇到问题时查阅 |

## 项目目录结构

```
src/logic/
├── home.rs              # 每个页面/功能一个 .rs 文件
├── editor.rs            # 复杂状态可用手动 UniFFI 标注
├── diff.rs              # 自由函数 + enum + struct 混合
├── extra_deps.toml      # 外部 Rust crate 依赖（可选）
├── native_deps.toml     # C/C++ 原生库依赖（可选）
└── native/              # C/C++ 库文件（可选）
```

**命名约定：**
- `.rs` 文件名 = 页面/功能名（如 `home.rs` 对应 `home.ae`）
- 文件中的主 `struct` 名 = PascalCase 页面名（如 `Home`、`EditorState`）
- 自动生成的 Manager 名 = `StructNameManager`（如 `EditorStateManager`）

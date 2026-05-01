# Logic 层开发指南

Aether 的 Logic 层是应用的状态与业务逻辑核心，基于 **Rust → UniFFI → Swift** 桥接架构。开发者只需编写普通的 Rust 代码，构建系统自动完成 UniFFI 桥接、状态管理器生成、Swift 绑定等所有工作。

## 架构流程

```
用户编写纯 Rust 代码（struct + impl + enum + fn）
        ↓
aether trans 自动转换（UniFFI derive、Mutex 包装、跨模块导出）
        ↓
cargo build 编译 Rust → UniFFI 生成 Swift 绑定
        ↓
自动生成 StateManager + ViewModel @Published 属性
        ↓
SwiftUI 通过 Manager / ViewModel 调用 Rust 逻辑
```

## 文档索引

| 文档 | 内容 | 何时阅读 |
|------|------|---------|
| [writing-rust.md](writing-rust.md) | Rust 代码编写规则：struct/enum/impl 写法、自动转换规则、方法分类、自由函数 | 开始写 .rs 文件前必读 |
| [state-sync.md](state-sync.md) | 状态同步机制：StateManager 生成、Getter/Action 映射、推送通知、增量刷新 | 需要理解 Swift 如何读取 Rust 状态时 |
| [binding.md](binding.md) | .ae 绑定语法：`{TypeName.field}`、`.click()` 事件分发、TextField 双向绑定 | 写 .ae 文件与 Rust 交互时 |
| [cross-module.md](cross-module.md) | 跨模块引用、外部 crate 依赖、类型映射表 | 需要跨 .rs 文件引用类型或使用 serde 等外部库时 |
| [native-bridge.md](native-bridge.md) | C/C++ 原生库桥接：bindgen、modulemap、C ABI 桥接 | 需要集成 .so/.dylib/.a 等已有 C/C++ 库时 |
| [faq.md](faq.md) | 常见问题与踩坑指南 | 遇到问题时查阅 |

## 项目目录结构

```
src/logic/
├── home.rs              # 每个页面/功能一个 .rs 文件
├── editor.rs            # 复杂状态可用手动 UniFFI 标注
├── diff.rs              # 自由函数 + enum + struct 混合
├── extra_deps.toml      # 外部 Rust crate 依赖（可选）
├── native_deps.toml     # C/C++ 原生库依赖（可选）
├── native/              # C/C++ 库文件（可选）
└── lib.rs               # 自动生成，开发者无需编辑
```

**命名约定：**
- `.rs` 文件名 = 页面/功能名（如 `home.rs` 对应 `home.ae`）
- 文件中的主 `struct` 名 = PascalCase 页面名（如 `Home`、`EditorState`）
- 自动生成的 Manager 名 = `StructNameManager`（如 `EditorStateManager`）

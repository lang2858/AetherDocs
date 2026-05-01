# 跨模块引用与外部依赖

Aether Logic 层支持跨 `.rs` 文件的类型引用和外部 Rust crate 依赖。本文档说明跨模块引用规则、`extra_deps.toml` 配置、以及 UniFFI orphan rule 限制下的外部类型使用策略。

---

## 1. 跨模块引用

### 1.1 模块导出机制

翻译器在 `lib.rs` 中为每个用户模块生成 `pub mod` 声明和 re-export：

```rust
// 自动生成的 lib.rs
pub mod home;
pub mod editor;
pub mod diff;

// 统一导出：让 use crate::* 能看到所有模块的 pub 类型
pub use home::*;
pub use editor::*;
pub use diff::*;
```

同时，每个模块文件头部会自动插入：

```rust
#[allow(unused_imports)]
use crate::*;
```

### 1.2 跨模块引用写法

开发者可以在任意 `.rs` 文件中引用其他模块的类型：

```rust
// src/logic/editor.rs
use crate::diff::{DiffOp, DiffError};

pub struct EditorState {
    // ...
}

impl EditorState {
    pub fn apply_diff(&mut self, old: &str, new: &str) -> Vec<DiffOp> {
        // 直接使用 diff 模块的类型
        diff::compute_diff(old, new)
    }
}
```

### 1.3 引用路径规范

| 写法 | 是否支持 | 说明 |
|------|---------|------|
| `use crate::diff::DiffOp;` | 推荐 | 绝对路径，最清晰 |
| `use crate::*;` | 支持 | 导入所有模块的 pub 类型（已自动插入） |
| `use super::diff::DiffOp;` | 不推荐 | 相对路径，翻译器不处理 |
| `use DiffOp;` | 不支持 | 翻译器未做路径规范化 |

**建议**：使用 `use crate::{module}::{Type};` 的绝对路径写法。

### 1.4 跨模块引用的限制

1. **只能引用同项目 `src/logic/` 下的模块** — 不能引用 Aether 框架内部类型
2. **引用的类型必须被 UniFFI 导出** — 如果引用的类型未在目标模块中声明为 `pub`，UniFFI 无法导出
3. **引用的类型必须在签名中合法** — 必须是 UniFFI 兼容类型（见 [writing-rust.md](writing-rust.md) 类型表）

---

## 2. 外部 Rust Crate 依赖 (extra_deps.toml)

### 2.1 配置文件

在 `src/logic/extra_deps.toml` 中声明外部 Rust crate 依赖：

```toml
[dependencies]
serde_json = "1.0"
syntect = "5.0"
regex = "1.10"

# 复杂依赖：指定 features
[dependencies.reqwest]
version = "0.12"
features = ["json"]
default-features = false
```

### 2.2 配置规则

| 规则 | 说明 |
|------|------|
| 文件位置 | `src/logic/extra_deps.toml` |
| 格式 | 标准 Cargo.toml `[dependencies]` 段格式 |
| 不能覆盖 `uniffi` | `uniffi = "..."` 会导致错误（与内置版本冲突） |
| crate 名必须合法 | 只允许字母、数字、`_`、`-` |
| 翻译器验证 | 解析时会检查格式和冲突 |

### 2.3 翻译器处理流程

1. 读取 `extra_deps.toml`
2. 解析为结构化依赖表
3. 验证每个 crate 名合法、不与内置依赖冲突
4. 合并到生成的 `logic/Cargo.toml` 的 `[dependencies]` 段

生成的 Cargo.toml 示例：

```toml
[package]
name = "aether_studio"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
uniffi = { version = "0.28", features = ["cli"] }
serde_json = "1.0"
syntect = "5.0"
regex = "1.10"
reqwest = { version = "0.12", features = ["json"], default-features = false }
```

### 2.4 不存在 extra_deps.toml

如果 `extra_deps.toml` 不存在，翻译器跳过，只保留内置的 `uniffi` 依赖。

---

## 3. UniFFI Orphan Rule 与外部类型

### 3.1 核心限制

UniFFI 的 orphan rule：**不能为外部 crate 的类型实现 `FfiConverter`**。这意味着外部类型（如 `serde_json::Value`、`syntect::Theme`）不能直接出现在跨 FFI 边界的 pub API 签名中。

### 3.2 正确用法：外部类型仅在方法体内部使用

```rust
use serde_json::Value as JsonValue;

pub struct EditorState {
    config_json: String,       // 存原始数据，不存外部类型
}

impl EditorState {
    // 外部类型只在方法体内部使用，不出现在签名中
    pub fn parse_and_validate(&mut self, json: &str) -> bool {
        match serde_json::from_str::<JsonValue>(json) {
            Ok(_) => { self.config_json = json.to_string(); true }
            Err(_) => false,
        }
    }

    // 如果必须返回外部类型的数据，转换为 Aether 自有类型
    pub fn get_config_keys(&self) -> Vec<String> {
        serde_json::from_str::<JsonValue>(&self.config_json)
            .ok()
            .and_then(|v| v.as_object().cloned())
            .map(|obj| obj.keys().cloned().collect())
            .unwrap_or_default()
    }
}
```

**原则**：
- **DO**：在方法体内部自由使用外部类型
- **DO**：将外部类型数据转换为 Aether 自有类型后返回
- **DON'T**：在 pub 方法签名中直接使用外部类型

### 3.3 必须暴露外部类型的场景：custom_type 包装

当外部类型必须出现在跨 FFI 边界的签名中时，使用 UniFFI 的 `custom_type!` 宏：

```rust
pub struct JsonValueWrapper(String);

impl UniffiCustomTypeConverter for JsonValueWrapper {
    type Builtin = String;  // 底层用 String 传输

    fn into_custom(val: String) -> uniffi::Result<Self> {
        serde_json::from_str::<JsonValue>(&val)?;
        Ok(JsonValueWrapper(val))
    }

    fn from_custom(obj: Self) -> String {
        obj.0
    }
}

uniffi::custom_type!(JsonValueWrapper, String);
```

Swift 侧看到的是 `String`，自动序列化/反序列化。

**注意**：当前 UniFFI 版本为 0.28，使用 trait 实现模式。UniFFI 0.31+ 提供更简洁的语法，升级后可简化。

### 3.4 外部类型使用检查清单

在写方法签名前，检查以下几点：

1. 返回类型是否来自外部 crate？→ 如果是，转换为自有类型
2. 参数类型是否来自外部 crate？→ 如果是，用 String 或基础类型替代
3. struct 字段是否包含外部类型？→ 如果是，替换为 String 存储原始数据
4. 方法体内部使用外部类型？→ 没问题，只在签名中有限制

---

## 4. 类型映射表

### 4.1 Rust → Swift 类型映射

| Rust 类型 | Swift 类型 | 备注 |
|-----------|-----------|------|
| `i8` | `Int8` | |
| `i16` | `Int16` | |
| `i32` | `Int32` | |
| `i64` | `Int64` | |
| `u8` | `UInt8` | |
| `u16` | `UInt16` | |
| `u32` | `UInt32` | |
| `u64` | `UInt64` | |
| `usize` | `Int` | |
| `isize` | `Int` | |
| `f32` | `Float` | |
| `f64` | `Double` | |
| `bool` | `Bool` | |
| `String` | `String` | |
| `&str` | `String` | 自动转换 |
| `Vec<T>` | `[T]` | T 需 UniFFI 兼容 |
| `Option<T>` | `T?` | T 需 UniFFI 兼容 |
| `HashMap<K, V>` | `[K: V]` | K/V 需 UniFFI 兼容 |
| 自定义 Enum | 同名 Enum | 需 `uniffi::Enum` |
| 自定义 Record | 同名 Record | 需 `uniffi::Record` |
| 自定义 Object | 同名 Object | 需 `uniffi::Object` |

### 4.2 Rust → Kotlin 类型映射（Android）

| Rust 类型 | Kotlin 类型 |
|-----------|------------|
| `i32` | `Int` |
| `u32` | `UInt` |
| `i64` | `Long` |
| `f64` | `Double` |
| `bool` | `Boolean` |
| `String` | `String` |
| `Vec<T>` | `List<T>` |
| `Option<T>` | `T?` |
| `HashMap<K, V>` | `Map<K, V>` |

---

## 5. 项目目录结构

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

**开发者只编辑**：
- `.rs` 文件（Rust 业务代码）
- `extra_deps.toml`（外部 Rust 依赖，可选）
- `native_deps.toml`（C/C++ 依赖，可选）

**自动生成，不要手动编辑**：
- `lib.rs`（模块声明 + UniFFI scaffolding + delegate traits）
- `ffi/` 目录（bindgen 生成的 FFI 声明）

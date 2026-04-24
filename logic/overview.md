# Logic 层架构概览

Aether 的 Logic 层是应用的状态与业务逻辑核心，基于 **Rust → UniFFI → Swift** 桥接架构实现。开发者只需编写普通的 Rust 代码，构建系统会自动完成 UniFFI 所需的转换。

## 架构流程

```
用户编写 Rust 结构体 + impl 块
        ↓
构建系统自动转换（添加 derive、包装 Mutex 等）
        ↓
UniFFI 生成 Swift 绑定
        ↓
SwiftUI ViewModel 调用 Rust 逻辑
```

## 自动转换规则

构建系统会根据 Rust 代码的形态，自动应用以下转换：

| Rust 原始形态 | 转换后 | 说明 |
|---|---|---|
| 结构体 + impl 块 | `#[derive(uniffi::Object)]`，字段包装为 `std::sync::Mutex<NameInner>` | 有行为的状态对象 |
| 结构体，无 impl | `#[derive(Clone, uniffi::Record)]` | 纯数据记录 |
| 枚举 | `#[derive(Clone, uniffi::Enum)]` | 枚举类型 |
| impl 块 | `#[uniffi::export]` | 导出方法 |
| `fn new()` | `#[uniffi::constructor]` | 构造函数 |
| `&mut self` 方法 | `&self`，方法体包装 `self.inner.lock().unwrap()` | 内部可变性 |

## 方法分类

构建系统根据方法签名自动将方法分为以下类别：

| 模式 | 分类 | Swift 映射 |
|---|---|---|
| `&self`，有返回类型，无额外参数 | Getter（状态读取） | `logic.getXxx()` |
| `&mut self`，名称以 `set_` 开头，1 个参数 | Setter（状态写入） | `logic.setXxx(value:)` |
| `&mut self`，无返回类型 | Action（动作） | `viewModel.actionName()` |
| `#[uniffi::constructor]` | Constructor（构造） | 不出现在 actions 列表中 |
| `get_state_json` / `set_state_json` | Helper（辅助） | 不出现在 actions 列表中 |

## 类型映射

Rust 类型到 Swift 类型的对应关系：

| Rust 类型 | Swift 类型 |
|---|---|
| `String` | `String` |
| `bool` | `Bool` |
| `i8` / `i16` / `i32` / `i64` | `Int` |
| `f32` / `f64` | `Float` |
| `Vec<T>` | `Array` |
| `Option<T>` | `Optional` |
| `Result<T, E>` | `Result` |

## 代码示例

### 用户编写的 Rust 代码

```rust
pub struct Home {
    count: i32,
    name: String,
}

impl Home {
    pub fn new() -> Self {
        Self { count: 0, name: String::new() }
    }

    pub fn get_count(&self) -> i32 {
        self.count
    }

    pub fn set_count(&mut self, value: i32) {
        self.count = value;
    }

    pub fn increment(&mut self) {
        self.count += 1;
    }
}
```

### 构建系统转换后的代码

```rust
#[derive(uniffi::Object)]
pub struct Home {
    inner: std::sync::Mutex<HomeInner>,
}

pub struct HomeInner {
    count: i32,
    name: String,
}

#[uniffi::export]
impl Home {
    #[uniffi::constructor]
    pub fn new() -> Self {
        Self { inner: std::sync::Mutex::new(HomeInner { count: 0, name: String::new() }) }
    }

    pub fn get_count(&self) -> i32 {
        self.inner.lock().unwrap().count
    }

    pub fn set_count(&self, value: i32) {
        self.inner.lock().unwrap().count = value;
    }

    pub fn increment(&self) {
        self.inner.lock().unwrap().count += 1;
    }
}
```

### 生成的 Swift 调用

| Rust 方法 | 分类 | Swift 调用 |
|---|---|---|
| `get_count(&self) -> i32` | Getter | `viewModel.logic.getCount()` |
| `set_count(&mut self, value: i32)` | Setter | `viewModel.logic.setCount(value: 10)` |
| `increment(&mut self)` | Action | `viewModel.increment()` |

通过这种自动转换机制，开发者可以专注于编写清晰的 Rust 业务逻辑，无需手动处理 UniFFI 的宏标注和内部可变性包装。

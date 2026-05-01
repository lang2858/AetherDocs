# C/C++ 原生库桥接

Aether 支持集成已有的 C/C++ 库（`.so`/`.dylib`/`.a`/`.dll` + 头文件），用于老应用迁移、高性能计算等场景。本文档说明三种桥接路径、`native_deps.toml` 配置、目录结构约定和内存安全策略。

---

## 1. 三种桥接路径

### 路径 A：Rust bindgen 桥接（推荐 — 逻辑层统一）

```
C++ .h → bindgen → Rust FFI 声明 → logic.rs 中调用 → UniFFI → Swift/Kotlin
```

**适用场景**：需要在 Rust 逻辑层中统一管理 C++ 库的状态和调用。

**开发者写法**：

```rust
// src/logic/video_processor.rs
use crate::ffi::video_lib::*;  // bindgen 生成的 FFI 声明

pub struct VideoProcessor {
    width: u32,
    height: u32,
}

impl VideoProcessor {
    pub fn new() -> Self {
        Self { width: 1920, height: 1080 }
    }

    pub fn process_frame(&mut self, data: &[u8]) -> Vec<u8> {
        unsafe {
            let result = video_process_frame(
                data.as_ptr(), data.len() as u32,
                self.width, self.height
            );
            let output = std::slice::from_raw_parts(result.data, result.len as usize).to_vec();
            video_free_result(result);
            output
        }
    }
}
```

**翻译器自动生成**：
- `logic/src/ffi/video_lib.rs` — bindgen 自动生成的 FFI 声明
- `logic/build.rs` — 编译时运行 bindgen

**优点**：逻辑层统一，所有业务代码走同一套 UniFFI 管道，Swift/Kotlin 侧无需额外桥接。

---

### 路径 B：Swift 直接 C 互操作（高性能场景）

```
C++ .h → modulemap → Swift 直接调用 C 函数
```

**适用场景**：性能要求极高（视频处理、音频渲染）且不需要逻辑层状态管理时。

**翻译器自动生成**：

```swift
// module.modulemap
module VideoLib {
    header "video_lib.h"
    link "video_lib"
    export *
}
```

**Swift 中直接使用**：

```swift
import VideoLib

func processFrame(_ data: Data) -> Data {
    data.withUnsafeBytes { ptr in
        let result = video_process_frame(
            ptr.baseAddress!.assumingMemoryBound(to: UInt8.self),
            UInt32(data.count), width, height
        )
        defer { video_free_result(result) }
        return Data(bytes: result.data, count: Int(result.len))
    }
}
```

**Kotlin 侧对应**：使用 `cinterop` 生成 Kotlin 绑定：

```kotlin
// native/video_lib.def — 自动生成
headers = video_lib.h
package = video.lib
```

**优点**：Swift 直接调用 C，无 FFI 开销。**缺点**：绕过逻辑层，状态不统一。

---

### 路径 C：Aether 管理的 C ABI 桥接层（跨平台一致）

```
C++ 库 → Aether 定义的 C ABI wrapper → 同时供 Rust 和 Swift/Kotlin 调用
```

**适用场景**：需要在 Rust 和 Swift 两端都调用同一 C++ 库。

**翻译器自动生成 C ABI 桥接头**：

```c
// aether_video_bridge.h
#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    const uint8_t* data;
    uint32_t len;
} AeByteBuffer;

// 开发者实现这些函数
AeByteBuffer ae_video_process(const uint8_t* data, uint32_t len, uint32_t w, uint32_t h);
void ae_buffer_free(AeByteBuffer buf);

#ifdef __cplusplus
}
#endif
```

**开发者提供 C++ 实现**：

```cpp
// aether_video_bridge.cpp — 开发者编写
#include "aether_video_bridge.h"
#include "video_lib.h"  // 内部 C++ 库

AeByteBuffer ae_video_process(const uint8_t* data, uint32_t len, uint32_t w, uint32_t h) {
    auto result = video_lib::process(data, len, w, h);
    AeByteBuffer buf;
    buf.data = result.data();
    buf.len = result.size();
    return buf;
}
```

**优点**：Rust 和 Swift 通过统一的 C ABI 调用，行为一致。

---

### 路径选择指南

| 场景 | 推荐路径 | 理由 |
|------|---------|------|
| 需要统一状态管理 | A (rust/bindgen) | 所有逻辑走 UniFFI 管道 |
| 性能敏感，Swift 直接调用 | B (swift_direct) | 无 FFI 开销 |
| Rust 和 Swift 都需要调用 | C (c_abi) | 统一 C ABI 契约 |
| 简单 C 库集成 | A (rust/bindgen) | 最简单，bindgen 自动化 |
| 跨平台一致性要求高 | C (c_abi) | 三端使用同一接口 |

---

## 2. native_deps.toml 配置

### 2.1 文件位置

`src/logic/native_deps.toml`

### 2.2 完整配置示例

```toml
[[native_lib]]
name = "video_lib"                     # 库名（必须：字母、数字、_、-）
bridge = "rust"                        # 桥接路径：rust | swift_direct | c_abi
headers = ["video_lib.h"]              # 头文件路径（相对于 native/ 目录）

[native_lib.rust]                      # bridge=rust 时的 bindgen 配置
generate = true                        # 自动运行 bindgen（默认 true）
link_type = "dynamic"                  # dynamic | static（默认 dynamic）

[native_lib.platforms.macos]
lib_path = "native/macos/libvideo_lib.dylib"
framework = false

[native_lib.platforms.ios]
lib_path = "native/ios/libvideo_lib.a"
framework = false

[native_lib.platforms.android]
lib_path = "native/android/{abi}/libvideo_lib.so"
abis = ["arm64-v8a", "armeabi-v7a", "x86_64"]

[[native_lib]]
name = "audio_engine"
bridge = "swift_direct"
headers = ["audio_engine.h"]

[native_lib.platforms.macos]
lib_path = "native/macos/AudioEngine.framework"
framework = true

[[native_lib]]
name = "shared_core"
bridge = "c_abi"
# c_abi 不需要 headers（自动生成桥接头）

[native_lib.platforms.macos]
lib_path = "native/macos/libshared_core.dylib"
```

### 2.3 配置字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 库名，只允许字母、数字、`_`、`-` |
| `bridge` | 否 | 默认 `"rust"`。可选：`rust`、`swift_direct`、`c_abi` |
| `headers` | 是（`c_abi` 除外） | 头文件路径，相对于 `native/` 目录 |
| `thread_safe` | 否 | 默认 `true`。影响 Rust 侧的 Mutex 包装策略 |
| `rust.generate` | 否 | 默认 `true`。是否自动运行 bindgen |
| `rust.link_type` | 否 | 默认 `"dynamic"`。链接方式 |
| `platforms.{platform}.lib_path` | 是 | 库文件路径，相对于项目根目录 |
| `platforms.{platform}.framework` | 否 | 默认 `false`。是否为 .framework bundle |
| `platforms.{platform}.abis` | 否 | Android ABI 列表 |

### 2.4 验证规则

翻译器解析 `native_deps.toml` 时会验证：

1. `name` 非空且只包含合法字符
2. `bridge` 必须是 `rust`、`swift_direct` 或 `c_abi`
3. `bridge != "c_abi"` 时必须提供 `headers`
4. `framework = true` 时 `lib_path` 应指向 `.framework` 目录

---

## 3. 目录结构约定

```
src/logic/
├── home.rs
├── editor.rs
├── extra_deps.toml              # Rust crate 依赖
├── native_deps.toml             # C/C++ 原生库依赖
├── native/                      # C/C++ 库文件
│   ├── video_lib.h              # 头文件
│   ├── aether_video_bridge.h    # C ABI 桥接头（bridge=c_abi 时自动生成）
│   ├── aether_video_bridge.cpp  # C ABI 桥接实现（bridge=c_abi 时开发者写）
│   ├── macos/
│   │   └── libvideo_lib.dylib
│   ├── ios/
│   │   └── libvideo_lib.a
│   ├── android/
│   │   ├── arm64-v8a/
│   │   │   └── libvideo_lib.so
│   │   └── x86_64/
│   │       └── libvideo_lib.so
│   └── windows/
│       └── video_lib.dll
└── ffi/                         # 自动生成的 FFI 声明（翻译器产出）
    └── video_lib.rs             # bindgen 生成（不要手动编辑）
```

### 3.1 文件归属

| 文件 | 谁创建 | 谁编辑 |
|------|-------|-------|
| `native/*.h` | 开发者提供 | 开发者 |
| `native/*/lib*.dylib` 等 | 开发者提供 | — |
| `aether_*_bridge.h` | 翻译器自动生成 | — |
| `aether_*_bridge.cpp` | 开发者编写 | 开发者 |
| `ffi/*.rs` | bindgen 自动生成 | — |
| `build.rs` | 翻译器自动生成 | — |

---

## 4. 构建流程集成

翻译器处理 `native_deps.toml` 后的完整流程：

### 4.1 Rust 侧（bridge=rust）

1. 生成 `logic/src/ffi/{name}.rs` — bindgen 输出的 FFI 声明
2. 生成 `logic/build.rs` — 配置 bindgen 和链接
3. 在 `Cargo.toml` 中添加 `build-dependencies = ["bindgen"]`（当需要 bindgen 时）
4. 配置 `println!("cargo:rustc-link-lib=...")` 和库搜索路径
5. 在 `lib.rs` 中生成 `pub mod ffi { ... }` 块

### 4.2 Swift 侧（bridge=swift_direct 或所有路径）

1. 生成 `module.modulemap` — 声明 C 头文件和 link 指令
2. 将 `.dylib`/`.framework` 复制到 Xcode 项目的 Frameworks 目录
3. 在 generated Xcode project 中添加链接标志

### 4.3 Kotlin 侧

1. 生成 `.def` 文件给 `cinterop`
2. 配置 `CInterop` task，指定头文件和库路径
3. Android: 按 ABI 分发 `.so`，配置 `jniLibs` 目录

### 4.4 C ABI 桥接（bridge=c_abi）

1. 生成 `aether_{name}_bridge.h` 头文件
2. 生成 Rust FFI 绑定 + Swift modulemap + Kotlin .def 三端绑定
3. 编译 C++ 桥接代码（如果开发者提供了 .cpp 实现）

---

## 5. 内存安全策略

C/C++ 库桥接的内存安全是核心关注点：

### 5.1 所有权规则

- Rust 侧负责所有 C 分配内存的释放
- 使用 RAII 封装确保自动释放：

```rust
pub fn process_frame(&mut self, data: &[u8]) -> Vec<u8> {
    unsafe {
        let result = video_process_frame(/* ... */);
        // 必须释放 C 分配的内存
        let output = std::slice::from_raw_parts(result.data, result.len as usize).to_vec();
        video_free_result(result);  // RAII 式释放
        output
    }
}
```

### 5.2 线程安全

- `native_deps.toml` 中 `thread_safe = true`（默认）→ 翻译器使用 Mutex 包装
- `thread_safe = false` → 不使用 Mutex，开发者需自行确保线程安全

### 5.3 空指针检查

所有从 C 返回的指针应在 Rust 侧做 null 检查：

```rust
unsafe {
    let ptr = c_function_returning_ptr();
    if ptr.is_null() {
        return Err("C function returned null".to_string());
    }
    // 使用 ptr ...
}
```

### 5.4 安全封装模式

为 unsafe FFI 调用提供安全封装：

```rust
// unsafe FFI 声明（bindgen 生成）
extern "C" {
    fn video_process_frame(data: *const u8, len: u32, w: u32, h: u32) -> VideoResult;
    fn video_free_result(result: VideoResult);
}

// 安全封装（开发者编写）
impl VideoProcessor {
    pub fn process_frame(&mut self, data: &[u8]) -> Vec<u8> {
        if data.is_empty() { return Vec::new(); }
        unsafe {
            let result = video_process_frame(data.as_ptr(), data.len() as u32, self.width, self.height);
            if result.data.is_null() { return Vec::new(); }
            let output = std::slice::from_raw_parts(result.data, result.len as usize).to_vec();
            video_free_result(result);
            output
        }
    }
}
```

---

## 6. 完整示例：集成 video_lib

### 6.1 项目结构

```
src/logic/
├── video_processor.rs
├── native_deps.toml
├── native/
│   ├── video_lib.h
│   └── macos/
│       └── libvideo_lib.dylib
```

### 6.2 native_deps.toml

```toml
[[native_lib]]
name = "video_lib"
bridge = "rust"
headers = ["video_lib.h"]

[native_lib.rust]
generate = true
link_type = "dynamic"

[native_lib.platforms.macos]
lib_path = "native/macos/libvideo_lib.dylib"
```

### 6.3 video_processor.rs

```rust
use crate::ffi::video_lib::*;

pub struct VideoProcessor {
    width: u32,
    height: u32,
}

impl VideoProcessor {
    pub fn new() -> Self {
        Self { width: 1920, height: 1080 }
    }

    pub fn get_width(&self) -> u32 { self.width }
    pub fn get_height(&self) -> u32 { self.height }

    pub fn process_frame(&mut self, data: &[u8]) -> Vec<u8> {
        if data.is_empty() { return Vec::new(); }
        unsafe {
            let result = video_process_frame(
                data.as_ptr(), data.len() as u32,
                self.width, self.height
            );
            if result.data.is_null() { return Vec::new(); }
            let output = std::slice::from_raw_parts(result.data, result.len as usize).to_vec();
            video_free_result(result);
            output
        }
    }

    pub fn set_dimensions(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
    }
}
```

### 6.4 翻译器自动生成

- `ffi/video_lib.rs` — bindgen 从 `video_lib.h` 生成
- `build.rs` — 配置 bindgen 运行和链接
- `VideoProcessorManager.swift` — 自动状态管理

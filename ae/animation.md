# 动画系统

Aether 动画系统提供 7 项基础动画能力 + 2 项动画控制 API，覆盖从简单过渡到复杂交互的完整动画场景。

---

## 设计原则

1. **声明式** — 在 DSL 中声明动画意图，框架生成平台原生实现
2. **状态驱动** — 动画由 Rust 状态变化触发，而非命令式调用
3. **平台原生** — Web 用 CSS transition/animation，Swift 用 SwiftUI animation，Android 用 Compose animation
4. **回调到 Rust** — 动画完成事件通过 onComplete 回调到 Rust 逻辑层

---

## 基础动画能力

### 1. 属性动画 `.animate()`

状态变化时自动过渡属性值（颜色、位置、大小等）。

```ae
Text("Tap me")
    .animate(duration=400, easing=easeInOut)
    .bg(#FF6B6B when={Home.is_active} else=#E8E8E8)
    .color(#FFFFFF when={Home.is_active} else=#333333)
    .onTap({Home.toggle_active()})
```

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| duration | Int | 300 | 过渡时长（毫秒） |
| easing | String | easeInOut | 缓动曲线：linear / easeIn / easeOut / easeInOut / spring |

**平台映射：**
- Web: `transition: property duration easing`
- Swift: `.animation(.easeInOut(duration:), value:)`
- Android: `animateContentSize()` + `Animatable`

---

### 2. Transition 过渡

元素显隐时的入场/出场动画。

```ae
Transition(show={Home.is_visible}, type=fade, duration=500) {
    Text("Hello! I fade in and out.")
}
```

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| show | Bool | 必填 | 控制显隐的状态绑定 |
| type | String | fade | 过渡类型：fade / slide |
| duration | Int | 300 | 过渡时长（毫秒） |

**平台映射：**
- Web: `opacity` transition + `data-transition` 属性
- Swift: `withAnimation { .transition(.opacity) }`
- Android: `AnimatedVisibility`

---

### 3. 关键帧动画 `KeyframeAnimation`

定义多步动画序列，通过 `.animate(name=)` 引用。

```ae
KeyframeAnimation(name="bounce", duration=600, easing=easeInOut) {
    keyframe(0%, scale=1, opacity=1)
    keyframe(50%, scale=1.3, opacity=0.7)
    keyframe(100%, scale=1, opacity=1)
}

Text("Bounce!")
    .animate(name="bounce")
```

**keyframe 支持的属性：**
- `scale` / `opacity` / `offsetX` / `offsetY` / `rotation`

**平台映射：**
- Web: `@keyframes` + `animation` CSS
- Swift: `UIView.animate(keyframes:)`
- Android: `Keyframe` + `ObjectAnimator`

---

### 4. 循环动画 `.animateOn()`

无限循环的预设动画效果。

```ae
Text("Pulsing")
    .animateOn(type=pulse, duration=1000)
```

**预设类型：**
| 类型 | 效果 |
|------|------|
| pulse | 缩放脉冲 (1→1.1→1) |
| rotate | 360° 旋转 |
| shake | 水平抖动 (-10px→10px) |
| bounce | 弹跳缩放 (1→1.2→1) |
| glow | 光晕闪烁 |

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | String | 必填 | 动画类型 |
| duration | Int | 1000 | 单次时长（毫秒） |
| repeat | Bool | true | 是否无限循环 |
| delay | Int | 0 | 延迟启动（毫秒） |

---

### 5. Spring 弹性动画

物理弹性效果，适合拖拽回弹、弹性过渡等场景。

```ae
Text("Spring!")
    .spring(damping=0.5, stiffness=200, response=0.4)
    .offset(x={Home.pos_x})
```

**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| damping | Float | 0.7 | 阻尼系数 (0~1)，越小越弹 |
| stiffness | Float | 200 | 刚度 |
| response | Float | 0.4 | 响应时间（秒） |

**平台映射：**
- Web: `transition: all ${response*1000}ms cubic-bezier(...)`（根据 damping 近似）
- Swift: `.animation(.spring(dampingFraction:stiffness:), value:)`
- Android: `springAnimation()`

---

### 6. Layout 动画 `.animateLayout()`

For 循环增删子元素时自动过渡布局变化。

```ae
VStack {
    For(data={Home.item_count}, key=index) {
        Text("Item").size(14).pad(8)
    }.animateLayout()
}
```

**平台映射：**
- Web: `layoutAnimBeforeRender()`/`layoutAnimAfterRender()` 记录位置差，生成 FLIP 动画
- Swift: `.animation(.default, value: items.count)`
- Android: `animateItem()`

---

### 7. 手势动画 `GestureDetector`

拖拽偏移实时绑定到状态。

```ae
GestureDetector(onDrag={Home.on_drag()}) {
    Text("Drag me!").pad(16).bg(#F0F0F0).radius(8)
}
```

---

## 动画控制 API

### `.onComplete(callback)` — 动画完成回调

动画播放完成时回调 Rust 方法，用于动画链（A完成→触发B）。

```ae
Text("Bounce!")
    .animate(name="bounce")
    .onComplete({Home.on_bounce_done()})
```

**数据流：**
```
AE: .onComplete({Home.on_bounce_done()})
  → Codegen: data-action="complete:Home.on_bounce_done()"
  → Runtime: animationend/transitionend 事件 → handleAction("Home", "on_bounce_done")
  → WASM: Home.on_bounce_done() 执行 Rust 逻辑
```

**支持场景：**
- 属性动画 + onComplete：transitionend 事件触发
- 关键帧动画 + onComplete：animationend 事件触发
- Transition + onComplete：transitionend 事件触发
- Spring + onComplete：transitionend 事件触发

**注意事项：**
- transitionend 会为每个过渡属性各触发一次，runtime 自动 debounce 合并
- 回调与 onTap 同构，通过 `complete:` 前缀区分

---

### `.trigger(when=Type.field)` — 编程式触发动画

从 Rust 侧触发 KeyframeAnimation 播放，而非仅页面加载时播放一次。

```ae
KeyframeAnimation(name="shake", duration=400, easing=easeIn) {
    keyframe(0%, offsetX=0)
    keyframe(25%, offsetX=-10)
    keyframe(75%, offsetX=10)
    keyframe(100%, offsetX=0)
}

Text("Shake me!")
    .animate(name="shake")
    .trigger(when={Home.should_shake})
```

Rust 侧触发：
```rust
pub fn trigger_shake(&self) {
    HOME_STATE.with(|s| { s.borrow_mut().should_shake = true; });
}

pub fn on_shake_done(&self) {
    HOME_STATE.with(|s| {
        s.borrow_mut().should_shake = false;  // 重置，允许再次触发
    });
}
```

**数据流：**
```
AE: .trigger(when={Home.should_shake})
  → Codegen: data-trigger="shake" data-trigger-when="Home.should_shake"
  → Runtime: updateUI() 检查 when 条件
  → false→true: 重播 CSS animation (animation=none → reflow → removeProperty)
  → true→false: 重置 _triggerState，允许再次触发
```

**注意：**
- trigger 元素初始 animation=none（阻止页面加载时自动播放）
- 配合 `.onComplete()` 重置 when 状态，实现可重复触发
- when 条件必须从 false→true 才会触发，相同值不会重播

---

## Web 平台实现细节

### CSS 级联规则

条件样式类 (ae-c*) 在基础类 (ae-*) 之后生成，确保 `when=` 条件样式优先级高于基础样式：

```css
.ae-7 { font-size: 14px; color: #1F2937 }    /* 基础类 */
.ae-c8 { color: #34C759 }                      /* 条件类 — 后声明，覆盖基础 color */
.ae-c9 { color: #CCCCCC }                      /* 条件类 — else 分支 */
```

### data-action 多动作

同一元素可同时有 click 动作和 complete 动作，用 `;` 分隔：

```html
<div data-action="Home.toggle_active();complete:Home.on_color_done()">Tap me</div>
```

### Runtime 函数

| 函数 | 说明 |
|------|------|
| `wireAnimationComplete()` | 为 `data-action*="complete:"` 元素绑定 animationend/transitionend 监听 |
| `checkAnimationTriggers()` | 检查 `data-trigger-when` 绑定变化，false→true 时重播动画 |
| `dispatchCompleteAction()` | 解析 `complete:Type.method()` → `handleAction(typeName, methodName)` |

---

## 完整示例

```ae
KeyframeAnimation(name="bounce", duration=600, easing=easeInOut) {
    keyframe(0%, scale=1, opacity=1)
    keyframe(50%, scale=1.3, opacity=0.7)
    keyframe(100%, scale=1, opacity=1)
}

KeyframeAnimation(name="shake", duration=400, easing=easeIn) {
    keyframe(0%, offsetX=0)
    keyframe(25%, offsetX=-10)
    keyframe(75%, offsetX=10)
    keyframe(100%, offsetX=0)
}

VStack(spacing=16) {
    // 属性动画 + onComplete
    Text("Tap me to toggle color")
        .animate(duration=400, easing=easeInOut)
        .bg(#FF6B6B when={Home.is_active} else=#E8E8E8)
        .color(#FFFFFF when={Home.is_active} else=#333333)
        .onTap({Home.toggle_active()})
        .onComplete({Home.on_color_done()})

    // 关键帧动画 + onComplete
    Text("Bounce!")
        .animate(name="bounce")
        .onComplete({Home.on_bounce_done()})

    // 编程式触发动画
    Button("Shake!" onTap={Home.trigger_shake()})
    Text("Shake me!")
        .animate(name="shake")
        .trigger(when={Home.should_shake})
        .onComplete({Home.on_shake_done()})

    // Transition 过渡
    Transition(show={Home.is_visible}, type=fade, duration=500) {
        Text("Hello! I fade in and out.")
    }

    // 循环动画
    Text("Pulsing").animateOn(type=pulse, duration=1000)

    // Spring 弹性动画
    Text("Spring!")
        .spring(damping=0.5, stiffness=200, response=0.4)
        .offset(x={Home.pos_x})

    // Layout 动画
    VStack {
        For(data={Home.item_count}, key=index) {
            Text("Item").size(14).pad(8)
        }.animateLayout()
    }
}
```

# 版本里程碑

Aether 版本演进与功能里程碑，按版本号组织。

> 版本号规则：minor 版本递增表示一个功能里程碑达成，patch 版本用于 bug 修复。

---

## v0.1.0 — 项目启动与基础设施 (2026-04-21)

- UniFFI 重构完成，Rust-Swift 桥接方案确立
- CLI `init` 命令与项目模板系统
- Schema 嵌入 CLI 二进制文件
- UDL 动态生成

---

## v0.2.0 — 核心组件与导航系统 (2026-04-22)

- 声明式 Toast/Dialog 组件 + 全局单例方案
- 多界面导航系统四阶段完成（路由解析、TabView 生成、平台适配、路由参数传递）
- Drawer 抽屉系统
- 键盘事件、Grid 布局、Button 按下效果
- 存储API、屏幕方向、触觉反馈
- 5 大应用场景能力规划（Chat、E-commerce、Image Editor、Video Editor、Data Visualization）

---

## v0.3.0 — 自定义组件与原生构建 (2026-04-24 ~ 04-25)

- 自定义组件系统 + 虚拟属性(.iconSize/.iconSpacing)支持
- 原生 .xcodeproj 生成 + Xcode Run 支持
- 自定义组件 `:` 前缀调用语法
- macOS 标题栏定制 + Toolbar 组件
- 按需代码生成 — 扫描 .ae/.rs 文件检测能力，条件生成 delegate/Platform.swift/lib.rs
- 用户 .rs 拆为独立模块文件
- 移除 SPM 构建支持，统一 Xcode 项目构建
- 修饰符增强：.h(infinity)/.w(infinity)、Divider 主题样式、ScrollView 子视图自动拉伸

---

## v0.4.0 — 编译器重构与主题系统 (2026-04-26 ~ 04-27)

- swiftui.rs 3062行拆为 swift/ 子模块，引入 ComponentGen trait + GenContext + ComponentRegistry
- project.rs 6518行拆为 project/ 子模块，delegate 生成改为数据驱动
- 系统化主题配色，所有组件引用 $colors 令牌
- 全局样式自动应用机制 — 所有组件自动附加主题样式
- 编译器诊断系统 — 引用验证、错误码、可点击输出
- Toolbar 引入 ToolbarItem/ToolbarItemGroup 显式位置声明
- HStack/VStack 新增 justify 属性

---

## v0.5.0 — Spec-Driven 编译管线 (2026-04-28 ~ 04-30)

- spec-driven parser + aether-lint 基于 IR 的语义校验
- 三层架构集成 — parse→lint→generate 管线
- codegen 平台架构重构，支持多平台后端
- lint 新增 E013/E022/E023/E024 校验规则
- 花括号不匹配检测 + 缩进辅助定位
- 自动生成 struct field getter
- 分文件 Swift 生成 + 组件独立 ViewModel + 参数传递
- Rust 内置 Swift 格式化器 + 布局修复

---

## v0.6.0 — Canvas 渲染与 AetherStudio 编辑器 (2026-05-01 ~ 05-04)

- Canvas 组件 + CanvasRenderer DisplayList 渲染
- ViewModel 自由函数调用 & Canvas rotationEffect
- AetherBoard 应用初始化
- AetherStudio 编辑器重构 — CodeEditor/Preview 组件拆分
- Block 自动布局 — LayoutEngine + parent_id 树形嵌套
- DynamicTabs、响应式布局、文件打开联动
- 工具交互优化 — 画笔/颜色/粗细选择、撤销重做、键盘快捷键
- 主题切换 + Canvas 暗黑模式适配
- 多语言语法高亮 — JSON 规则 + 运行时 Bundle 加载
- For/If 组件 IR 生成
- Canvas 逻辑从框架层解耦至应用层

---

## v0.7.0 — AetherRuntime 运行时库 (2026-05-05 ~ 05-06)

- AetherRuntime 运行时库 — 提取 Swift 模板代码到独立 Package
- 删除 25 个 managers SWIFT_CODE — DelegateImpl 直接生成 + swift_templates 精简
- KeyboardMonitor/StorageManager/DrawerManager/DelegateBridge/AetherBridge 移入 AetherRuntime
- AeSplitView 折叠/展开 + 侧栏切换按钮
- FileTree autoWatch 文件系统监控 — DispatchSource (kqueue) 实时刷新
- If/Else 代码生成修复
- 欢迎界面 + 打开项目功能

---

## v0.8.0 — 实时预览与增量编译 (2026-05-07 ~ 05-11)

- AeCodeEditor 行号对齐 + 当前行高亮 + Cmd+S + sync 开关
- IR source_end_line tracking — 双向选择同步
- selection sync codegen + 300ms debounce + 增量编译
- runtime selection sync highlight + nested ScrollView auto-scroll
- SVG 预览支持 — resvg 转换 + 两级缓存
- 迁移 AeEditorTabs 到 AE DSL + Rust 实现
- component params $→# 语法变更
- ScrollView scrollTo 属性 + ScrollViewReader
- FileTree 从 runtime 迁移为 AE 组件
- AeValue 类型化 IR + resolution/modifier 重构
- 增量编译 manifest 系统 — 文件级追踪替代全量哈希
- 消除 codegen 层所有 extract_attribute 字符串解析

---

## v0.9.0 — 多平台与 Web 后端 (2026-05-11 ~ 05-14)

- Web 平台后端 — HTML/CSS 输出
- Web 平台基础架构 — 平台抽象层 + 运行时 JS
- IR 属性缺省值系统 — spec 定义默认值 → apply_defaults() 统一填充
- Modal 组件 + 组件参数类型系统 + #paramRef 引用
- i18n 插值参数 + 模板系统重构 + web/runtime i18n
- Welcome 界面增强 + PathField 组件
- Text maxLines/overflow + 多项 codegen 修复
- dispatcher 增量生成 + 状态绑定解析增强

---

## v0.10.0 — 工程化与 UniFFI 桥接 (2026-05-15)

- 增量编译 manifest 系统 + write_if_changed 保留文件 mtime
- dispatcher 增量生成 + 状态绑定解析增强
- aether-lang/parser/validate 增强
- codegen 全面增强 — dispatcher/lifecycle/assets/i18n/theme/resolution 多模块改进
- Tooltip modifier + animated hover overlay
- Popover 组件 + click arg 解析
- #[uniffi::export] impl blocks 自动发现与提升（支持 mod 子模块）
- bridge_parser — 从编译后的 dylib 提取 UniFFI 方法签名
- platform_runtime 通过 include_dir! 嵌入，消除外部 runtimes 目录
- UniFFI 参数标签、Option 解包、ForEach 类型转换等多项修复
- 零编译警告

---

## v0.11.0 — 测试框架与 Web 平台增强 (2026-05-16 ~ 05-22)

- 新增 `aether-test` crate — 自动化 UI 测试框架
  - agent_client WebSocket 客户端 + runner 测试执行引擎
  - CLI `aether test` 子命令 + `--test-port` 参数
- Web 平台组件全面增强
  - Text: 状态绑定 data-bind + i18n 运行时解析
  - Card/Section: bg/radius/shadow/padding/border + 主题 token
  - List/ListItem: spacing→gap + 主题边框
  - HStack: wrap + justify/alignment → flex 属性
  - TextField: variant(filled/outlined)/secure/disabled/label + 主题 token
  - TextArea/Toggle/Checkbox/Select: disabled/checked + 主题 accent-color
  - CollapseItem: expanded → `<details open>`
  - Button: secondary/ghost variant + 主题 token
- Web 平台核心改进
  - styles_to_css 传入 theme/i18n，彻底消除未解析 $colors.xxx token
  - modifier.rs 合并主题默认样式
  - 条件修饰符 when= → data-cond 属性
  - If/ElseIf/Show 条件解析 resolve_condition_binding
  - dispatcher generate_theme_css 输出 spacing/radius/typography/fonts CSS 变量
- Runtime.js 增强
  - evaluateCondition() 取反/方法调用/等值比较
  - data-cond/data-show/data-bind 运行时支持
- Web 平台架构
  - 新增 web_lifecycle.rs — Web 专属生命周期模块
  - WebBackend WasmMode (wasm/server)
  - 自定义字体加载和 $fonts 主题令牌解析

---

## v0.12.0 — Windows 平台上线 (2026-05-26)

- Windows 平台 PyQt6 代码生成后端完整功能
  - 40+ 组件生成器 (display/input/container/layout_utils/misc/control)
  - collect_ae_styles + merge_and_apply_styles + QSS 混合样式方案
  - 状态绑定解析 (resolution.rs) + 事件处理 (modifier_handler.rs)
  - Python runtime 16 个 manager 文件，include_dir! 嵌入编译
  - navigation/system_ui/storage/clipboard 等 runtime manager
- Windows 构建与打包
  - PyInstaller exe 打包 + DLL 依赖修复
  - install.sh 路径分隔符兼容
  - gen_context style snapshot/restore + container layout_name borrow 修复
- preview-gallery 可生成完整 gen/windows/ 并成功启动
- 多项编译 warning 清理与修复

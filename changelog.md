# 更新记录

项目演进与迭代日志，按日期汇总提交记录。

---

## 2026-05-15

- 增量编译 manifest 系统 — 文件级追踪替代全量哈希
- 全局替换 `fs::write` → `write_if_changed` 保留文件 mtime
- Swift UI 生成修复 — ForEach getter + italic 兼容性 + Binding setter
- Manager setter 第一个参数用 `_` 省略外部标签 + `ExtractedModule` 记录 `source_dir`
- AeClaw 主题添加缺失颜色定义
- AeClaw AI 助手项目
- 依赖路径统一从 `aether.toml` 目录计算 + lint 识别 `project.dependencies`
- Dispatcher 增量生成 + 状态绑定解析增强 + 多项 codegen 改进
- AetherStudio logic 更新 + Swift runtime 改进 + CLI 调整
- aether-lang 语言层改进 + 项目模板更新

## 2026-05-14

- Modal 组件 Swift codegen + 组件参数类型系统 + `#paramRef` 引用
- i18n 插值参数 + 模板系统重构 + web/runtime i18n + dev-docs 拆分
- Welcome 界面增强 + PathField 组件 + Text `maxLines`/`overflow` + 多项 codegen 修复
- PathField setter 调用 manager 方法同步 Rust 状态
- 移除模板 init 时自动生成 `routes.ae` 的默认逻辑
- 模板项目编译修复 — Home struct 命名 + Manager codegen + `$binding` 解析
- 静默 xcodebuild 冗长日志，构建失败时只显示错误行

## 2026-05-13

- `sys_run_on_ui` 跨平台 UI 线程调度 + `OnceLock` 单例修复 + AeEditorTabs 迁移

## 2026-05-12

- Editor tabs ZStack 堆叠关闭按钮 + `TabInfo.show_close` + `hovered_tab_path`
- SVG 图标缩放 + `applied sentinel` 通用传播 + `onHover` 动作回调
- `apply_defaults` `has_explicit` 检查 `.color` + ZStack alignment 枚举扩展
- 移除 Tailwind CSS — IR 属性直接生成内联 CSS
- IR 属性缺省值系统 — spec 定义默认值 → `apply_defaults()` 统一填充
- Web codegen 组件实现 + ZStack 叠层修复 + Swift 适配
- Web 平台基础架构 — 平台抽象层 + Tailwind 映射 + 运行时 JS

## 2026-05-11

- Web 平台后端 — HTML/CSS 输出
- aether-lang 清理 + 文件目录重构
- `ParamRef(#)` 解析 + `AePreviewCanvas` 无预览时宽度修复
- 组件参数 `$→#` + FileTree 从 runtime 迁移到 AE 组件
- ScrollView codegen — `LazyVStack` + `ScrollViewReader`/`scrollTo`
- 文件树样式与交互 — 选中态/hover/scrollTo/点击打开

## 2026-05-10

- TabInfo 结构体 + AeEditorTabs 迁移到 AE DSL + Rust 实现
- Text/Icon 支持 `fg` 属性 + Text 内联 weight
- SVG 预览支持 — resvg 转换 + `[logic]` 配置 + 两级缓存
- AetherStudio selection sync + nested scroll + debounce
- Selection sync codegen + 300ms debounce + 增量编译
- IR `source_end_line` 双向选区同步追踪

## 2026-05-09

- SplitView 分隔条优化 + 控制台折叠 + 统一工具栏高度
- IconButton 修复 — `renderingMode(.template)` + color/iconSize
- IconButton modifier merging + ElseIf 组件
- 图片文件预览 + 文件保存修复 + 二进制文件保护 + 脏标记修正
- SplitView `firstCollapsed`/`secondCollapsed` + 眼睛图标切换
- 移除 `SplitDragBar`，在 Editor Tabs 和 Preview 顶部添加切换按钮
- 预览组件颜色系统迁移 + Swift 运行时核心更新
- `AePreviewCanvas` 支持 `projectDir` + `aether.toml` 移至 `src/`

## 2026-05-08

- 字体主题 token 解析 + Tag bg/color + 预览读取默认主题/语言
- 预览 If/Else 修复 + 解析 `components/` 目录合并 `component_defs`
- CTFontManager 字体注册 + `AeSplitView` 刷新修复 + gallery 侧栏导航
- `AeValue` 类型化 IR + resolution/modifier 重构 + config/lifecycle 更新
- 消除 codegen 层所有 `extract_attribute` 字符串解析 + 修复 manager 变量和 PreviewCanvas 生成 bug

## 2026-05-07

- AeLog bridge + Preview 自定义字体注册 + font name:size 解析
- Parser 裸参数识别 + 修饰符值去引号 + 语法高亮改用临时属性(修复 undo)
- `AeCodeEditor` 行号对齐 + 当前行高亮 + Cmd+S + sync 开关

## 2026-05-06

- `AeSplitView` 折叠状态修复 + AIPanel/Preview 布局调整
- FileTree autoWatch 文件系统监控 — DispatchSource (kqueue) 实时刷新

## 2026-05-05

- `when=` 条件修饰符输出顺序 + `AeSplitView` 折叠重构
- 去掉 Button 默认 padding/cornerRadius 主题样式
- `AeSplitView isSecondCollapsed` + 侧栏切换按钮 + icon-only Button
- DynamicTabs 添加 `.onTapGesture` 切换 + 精简工具栏
- AetherBridge `#if` 条件编译 + AppColors 主题分发 + AtomicBool
- Manager 总是生成 `subscribeObserver` + App 入口自动订阅
- `SWIFT_ACTIVE_COMPILATION_CONDITIONS` 修正 + NSOpenPanel 异步 API
- 运行时重构 — DrawerManager/DelegateBridge/KeyboardMonitor 等移入 AetherRuntime
- 删除 25 个 managers SWIFT_CODE — DelegateImpl 直接生成
- AetherRuntime 运行时库 — 提取 Swift 模板代码到独立 Package
- 移除 `transform.rs` + 修复类型映射/Text 插值/Canvas 模板

## 2026-05-04

- 顶部 Run 按钮支持 macOS 本机运行
- 欢迎界面路由切换 + If/Else codegen 修复
- Canvas singleton 模式 + 工具栏状态同步
- Canvas 逻辑移至 Rust 层实现跨平台支持
- 解耦 Board Canvas 逻辑，从框架层移至应用层
- Canvas 注释锚点按类型计算 + 自由文本输入覆盖层
- AetherBoard — `add_board` + 响应式布局
- For/If 组件 IR 生成 + DynamicTabs + 响应式布局 codegen
- EditorState 方法 — `activateTab`/`closeTab` + editor mode 快捷方法
- 多语言语法高亮 — JSON 规则 + 运行时 Bundle 加载

## 2026-05-03

- Delegate 线程安全 (OnceLock+Mutex) + 增量构建 hash + If 条件绑定
- `view_gen.rs` 拆分为 5 个子模块
- Home.`add_board()` — 新建画板 Rust 方法
- `onTap` 绑定解析 — 组件参数替换 + 通用 `Type.method()` 路由
- 浮动 InputBar + 缩放指示器绑定 + `.onTap` 修饰符 + `reorderTabs`
- Cursor API + 主题切换 + 画板选中态 + 缩放指示器
- UI 七项优化 — border方向/增量加载/tab拖拽/语法高亮/状态栏动态

## 2026-05-02

- Canvas 光标随工具切换 + AetherBoard 画板列表布局
- 文件树手动递归渲染 — 点击整行展开/折叠 + chevron 动画
- 主题切换按钮 + Canvas 暗黑模式适配
- 笔画粗细选中高亮 + 颜色选择高亮 + 预设颜色
- 工具交互优化 — cross/note 点击放置 + Cmd+Z 撤销
- 撤销/重做 + 键盘快捷键 + 缩放指示器
- InputBar 工具选中 + 颜色/粗细选择 + Canvas 背景纹理
- 响应式布局三层实现 + DynamicTabs 组件
- 文件打开联动 + 编辑器内容显示

## 2026-05-01

- Block 自动布局 — LayoutEngine + 树形嵌套 + 内容自适应高度
- AetherStudio 编辑器重构 — CodeEditor/Preview 组件拆分
- AetherBoard 应用初始化 + Canvas DisplayList 动态渲染
- ViewModel 自由函数调用 + Canvas rotationEffect
- Block/Markup/DisplayList 数据结构 + CanvasRenderer DisplayList 渲染
- TextField、ScrollView、SplitView、TabBar 组件支持
- 修饰符增强 + 自定义字体支持 + 背景平铺
- 跨文件组件引用 lint 错误 + App 入口视图推断

## 2026-04-30

- SplitView 拖拽优化 + 移除主题默认边框
- Rust 内置 Swift 格式化器 + 布局修复 + List 背景透明
- 分文件 Swift 生成 + 组件独立 ViewModel + 参数传递
- 主题默认值修正 + parser 支持 `{}` binding 值解析
- `project_navigator` state-binding + FileTree 路径动态绑定
- 自动生成 struct field getter + Rust 解析错误信息加文件路径
- macOS sandbox 配置项 + `flexGrow` 直接父级方向判断
- ToolbarItem 组件 + E022 中文引号检测 + `flexGrow` 修复

## 2026-04-29

- E013 统一花括号不匹配检测（少了 `{` 和少了 `}` 两种情况）
- E013 诊断行号指向怀疑行而非文件末尾
- 新增 `w(fit)`/`h(fit)` 内容自适应修饰符

## 2026-04-28

- 自动隐藏系统标题栏 + lint 组件目录检测 + `align` 统一方向中性值
- `AeModifier` 记录独立 `source_line` + ComponentClose 修饰符校验
- lint 新增 E022/E023/E024 校验规则
- Codegen 平台架构重构，支持多平台后端
- L1+L2 — delegate 映射数据驱动化, `from_ae_scan` 改用 AeDoc IR
- Codegen HIGH 优化 — 消除死代码、规格驱动修饰符检测、集中映射
- 三层架构集成 — spec 重命名 + 配置校验 + `parse→lint→generate` 管线
- Spec-driven parser + aether-lint 基于 IR 的语义校验

## 2026-04-27

- 组件展开时诊断信息指向正确的源文件和行号
- 编译器诊断系统 — 引用验证、错误码、可点击输出
- 全局样式统一应用机制 — 所有组件自动附加主题样式
- 系统化主题配色，所有组件引用 `$colors` 令牌

## 2026-04-26

- `.mar()` margin 机制 + weight modifier (`.bold`/`.semibold` 等)
- 自定义 Toolbar 视图结构 + TOOLBAR 标记线替代字符串匹配
- `.w(infinity)` 生成 `.frame(maxWidth: .infinity)`
- HStack/VStack `justify` 属性 + Toolbar placement 简化
- `project.rs` 拆为 `project/` 子模块 + delegate 生成数据驱动
- `swiftui.rs` 拆为 `swift/` 子模块 + `ComponentGen` trait + `GenContext`

## 2026-04-25

- 按需代码生成 — 扫描 `.ae`/`.rs` 文件检测能力，条件生成
- NavigationStack/NavigationSplitView macOS 版本适配
- titlebar_style macOS 版本适配 + 自定义组件 `:` 前缀
- Toolbar 生成代码用 `ToolbarItemGroup` 包裹
- macOS 标题栏定制 + Toolbar 组件
- 移除 SPM 构建支持，统一使用 Xcode 项目构建
- VStack/HStack/ZStack `align` 参数与 `spacing` 同时使用修复

## 2026-04-24

- ScrollView 子视图 `.frame()` 修饰符位置修复 + 自动 maxWidth
- Divider 支持主题样式 + `.h(infinity)`/`.w(infinity)` 支持
- FileTree 主题感知 + `onSelect` 不再硬编码默认回调
- 原生 `.xcodeproj` 生成 + Xcode Run 修复 (v1.13)
- 自定义组件系统 + 虚拟属性支持 (v1.12)

## 2026-04-22

- Document Reader / Chart / 3D / GPU Filter / Video Editor / Image Editor / E-commerce / Chat App 能力支持
- Button 选中状态 + Text 格式化 + 存储 API + 键盘事件 + Grid 布局
- Drawer 抽屉系统 + Toast/Dialog 根视图单次挂载
- 多界面导航 4 阶段 — 路由参数传递/平台适配/TabView 生成/基础导航
- 声明式 Toast 组件 + 全局 sys Toast/Dialog 单例
- `aether.toml` 项目配置 + 构建目录按平台组织
- AE 语法使用 Rust 风格直接成员访问 + SPM 构建修复

## 2026-04-21

- UDL 动态生成 + 模板方式创建完整工程
- Schema 嵌入 CLI 二进制 + 安装到用户目录
- Aether UniFFI 重构完成 + init 生成完整计数器示例

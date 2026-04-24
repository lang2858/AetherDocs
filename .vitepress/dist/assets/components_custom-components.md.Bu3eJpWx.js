import{_ as a,o as n,c as e,ag as t}from"./chunks/framework.CAXxHpAX.js";const u=JSON.parse('{"title":"自定义组件 / Custom Components","description":"","frontmatter":{},"headers":[],"relativePath":"components/custom-components.md","filePath":"components/custom-components.md","lastUpdated":null}'),p={name:"components/custom-components.md"};function i(o,s,l,c,d,r){return n(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="自定义组件-custom-components" tabindex="-1">自定义组件 / Custom Components <a class="header-anchor" href="#自定义组件-custom-components" aria-label="Permalink to &quot;自定义组件 / Custom Components&quot;">​</a></h1><p>Aether 支持自定义组件，允许开发者封装可复用的 UI 片段。组件在编译时内联展开，经过完整的 codegen 流程处理。</p><hr><h2 id="定义方式" tabindex="-1">定义方式 <a class="header-anchor" href="#定义方式" aria-label="Permalink to &quot;定义方式&quot;">​</a></h2><h3 id="_1-内联定义" tabindex="-1">1. 内联定义 <a class="header-anchor" href="#_1-内联定义" aria-label="Permalink to &quot;1. 内联定义&quot;">​</a></h3><p>在 <code>.ae</code> 文件中直接声明组件：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component ActionButton(icon, label, onClick, color=&quot;$colors.text&quot;, width=220) {</span></span>
<span class="line"><span>    Button(label onClick={onClick}) {</span></span>
<span class="line"><span>        HStack(spacing=8) {</span></span>
<span class="line"><span>            Icon(name=icon size=16 color=color)</span></span>
<span class="line"><span>            Text(label size=14 color=color)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .pad(left=12 right=16 top=8 bottom=8)</span></span>
<span class="line"><span>        .bg(opacity=0)</span></span>
<span class="line"><span>        .border(color=color width=1 radius=8)</span></span>
<span class="line"><span>        .w(width)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-独立文件定义" tabindex="-1">2. 独立文件定义 <a class="header-anchor" href="#_2-独立文件定义" aria-label="Permalink to &quot;2. 独立文件定义&quot;">​</a></h3><p>在 <code>src/ui/components/</code> 目录下创建 <code>.ae</code> 文件，文件名自动转换为 PascalCase 组件名：</p><table tabindex="0"><thead><tr><th>文件路径</th><th>组件名</th></tr></thead><tbody><tr><td><code>src/ui/components/action_button.ae</code></td><td><code>ActionButton</code></td></tr><tr><td><code>src/ui/components/partition_card.ae</code></td><td><code>PartitionCard</code></td></tr><tr><td><code>src/ui/components/nav_section.ae</code></td><td><code>NavSection</code></td></tr><tr><td><code>src/ui/components/gap_divider.ae</code></td><td><code>GapDivider</code></td></tr><tr><td><code>src/ui/components/select_field.ae</code></td><td><code>SelectField</code></td></tr></tbody></table><hr><h2 id="无名组件" tabindex="-1">无名组件 <a class="header-anchor" href="#无名组件" aria-label="Permalink to &quot;无名组件&quot;">​</a></h2><p>使用 <code>component()</code> 声明（无参数）时，文件名即为组件名：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// src/ui/components/project_navigator.ae</span></span>
<span class="line"><span>component() {</span></span>
<span class="line"><span>    VStack(spacing=0) {</span></span>
<span class="line"><span>        Text(&quot;PROJECT&quot; size=11 color=&quot;$colors.text_hint&quot; weight=&quot;semibold&quot;)</span></span>
<span class="line"><span>            .pad(left=16 top=8 bottom=4)</span></span>
<span class="line"><span>        FileTree(root=&quot;/src&quot; onSelect={Home.on_file_select()} filter=&quot;*.swift&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .bg(&quot;$colors.surface&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>组件名 → <code>ProjectNavigator</code>（由文件名 <code>project_navigator.ae</code> 转换）。</p><hr><h2 id="参数定义" tabindex="-1">参数定义 <a class="header-anchor" href="#参数定义" aria-label="Permalink to &quot;参数定义&quot;">​</a></h2><p>参数以逗号分隔，可选参数使用 <code>=</code> 指定默认值：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component(icon, label, size=100, color=&quot;$colors.primary&quot;) {</span></span>
<span class="line"><span>    // body</span></span>
<span class="line"><span>}</span></span></code></pre></div><table tabindex="0"><thead><tr><th>参数</th><th>必填</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>icon</td><td>是</td><td>—</td><td>图标名称，无默认值</td></tr><tr><td>label</td><td>是</td><td>—</td><td>文字，无默认值</td></tr><tr><td>size</td><td>否</td><td>100</td><td>尺寸，默认 100</td></tr><tr><td>color</td><td>否</td><td>$colors.primary</td><td>颜色，默认主题色</td></tr></tbody></table><h3 id="参数类型" tabindex="-1">参数类型 <a class="header-anchor" href="#参数类型" aria-label="Permalink to &quot;参数类型&quot;">​</a></h3><p>参数类型均为字符串，codegen 时根据上下文推断实际类型：</p><ul><li><strong>数字</strong>：<code>size=100</code> → Swift <code>CGFloat(100)</code></li><li><strong>颜色引用</strong>：<code>color=&quot;$colors.primary&quot;</code> → Swift <code>AppColors.primary</code></li><li><strong>资源引用</strong>：<code>icon=$assets.gear</code> → Swift <code>AppAssets.gear</code></li><li><strong>回调</strong>：<code>onClick={Home.on_tap()}</code> → Swift 闭包</li></ul><hr><h2 id="组件体-body" tabindex="-1">组件体（Body） <a class="header-anchor" href="#组件体-body" aria-label="Permalink to &quot;组件体（Body）&quot;">​</a></h2><p>花括号 <code>{ }</code> 之间的 AE 代码行构成组件体。使用 <code>{paramName}</code> 引用参数值：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component(icon, label, onClick, color=&quot;$colors.primary&quot;) {</span></span>
<span class="line"><span>    HStack(spacing=8) {</span></span>
<span class="line"><span>        Icon(name={icon} size=16 color={color})</span></span>
<span class="line"><span>        Text({label} size=14 color={color})</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .pad(12)</span></span>
<span class="line"><span>    .bg(opacity=0)</span></span>
<span class="line"><span>    .border(color={color} width=1 radius=8)</span></span>
<span class="line"><span>    .onClick({onClick})</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>{icon}</code>、<code>{label}</code> 等参数引用在展开时被实际传入值替换。</p><hr><h2 id="调用组件" tabindex="-1">调用组件 <a class="header-anchor" href="#调用组件" aria-label="Permalink to &quot;调用组件&quot;">​</a></h2><p>使用组件名加属性的方式调用，传入的参数覆盖默认值：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ActionButton(icon=&quot;plus&quot; label=&quot;Create&quot; onClick={Home.on_create()})</span></span></code></pre></div><p>未传入的可选参数使用定义时的默认值：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// color 使用默认值 &quot;$colors.text&quot;，width 使用默认值 220</span></span>
<span class="line"><span>ActionButton(icon=&quot;plus&quot; label=&quot;Create&quot; onClick={Home.on_create()})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 覆盖 color 和 width</span></span>
<span class="line"><span>ActionButton(icon=&quot;trash&quot; label=&quot;Delete&quot; onClick={Home.on_delete()} color=&quot;$colors.error&quot; width=180)</span></span></code></pre></div><hr><h2 id="展开机制" tabindex="-1">展开机制 <a class="header-anchor" href="#展开机制" aria-label="Permalink to &quot;展开机制&quot;">​</a></h2><p>自定义组件在编译时<strong>内联展开</strong>到调用位置，然后递归通过完整的 codegen 流程处理。展开后的代码行可以包含进一步的组件调用，形成递归展开链。</p><h3 id="展开过程" tabindex="-1">展开过程 <a class="header-anchor" href="#展开过程" aria-label="Permalink to &quot;展开过程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. 解析调用 → ActionButton(icon=&quot;plus&quot; label=&quot;Create&quot; onClick={Home.on_create()})</span></span>
<span class="line"><span>2. 查找定义 → component ActionButton(icon, label, onClick, color=&quot;$colors.text&quot;, width=220) { ... }</span></span>
<span class="line"><span>3. 参数绑定 → icon=&quot;plus&quot;, label=&quot;Create&quot;, onClick={Home.on_create()}, color=&quot;$colors.text&quot;, width=220</span></span>
<span class="line"><span>4. 替换引用 → {icon} → &quot;plus&quot;, {label} → &quot;Create&quot;, {onClick} → Home.on_create(), {color} → &quot;$colors.text&quot;, {width} → 220</span></span>
<span class="line"><span>5. 内联展开 → 将替换后的 body 插入调用位置</span></span>
<span class="line"><span>6. 递归处理 → 展开后的代码继续经过 codegen 流程</span></span></code></pre></div><h3 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h3><p>定义：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// src/ui/components/gap_divider.ae</span></span>
<span class="line"><span>component(gap=8) {</span></span>
<span class="line"><span>    Spacer(h=gap)</span></span>
<span class="line"><span>    Divider()</span></span>
<span class="line"><span>    Spacer(h=gap)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=0) {</span></span>
<span class="line"><span>    Text(&quot;标题&quot; size=18 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>    GapDivider(gap=16)</span></span>
<span class="line"><span>    Text(&quot;内容&quot; size=14)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>展开后：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=0) {</span></span>
<span class="line"><span>    Text(&quot;标题&quot; size=18 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>    Spacer(h=16)</span></span>
<span class="line"><span>    Divider()</span></span>
<span class="line"><span>    Spacer(h=16)</span></span>
<span class="line"><span>    Text(&quot;内容&quot; size=14)</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h2 id="动态资源引用" tabindex="-1">动态资源引用 <a class="header-anchor" href="#动态资源引用" aria-label="Permalink to &quot;动态资源引用&quot;">​</a></h2><p>参数值可以用于动态构建资源引用。使用 <code>$assets.{icon}</code> 语法，其中 <code>{icon}</code> 是参数名：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component(icon, label, onClick) {</span></span>
<span class="line"><span>    HStack(spacing=8) {</span></span>
<span class="line"><span>        Image(src=$assets.{icon} size=20)</span></span>
<span class="line"><span>        Text({label} size=14)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .onClick({onClick})</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>调用：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ActionButton(icon=&quot;plus&quot; label=&quot;新建&quot; onClick={Home.on_create()})</span></span></code></pre></div><p>展开后 <code>{icon}</code> 被替换为 <code>&quot;plus&quot;</code>：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HStack(spacing=8) {</span></span>
<span class="line"><span>    Image(src=$assets.plus size=20)</span></span>
<span class="line"><span>    Text(&quot;新建&quot; size=14)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.onClick(Home.on_create())</span></span></code></pre></div><p>SwiftUI 输出：</p><div class="language-swift vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">swift</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">HStack</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">spacing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    Image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">uiImage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: AppAssets.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">plus</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">resizable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">frame</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;新建&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">font</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">system</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">14</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">onTapGesture</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { viewModel.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">onCreate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() }</span></span></code></pre></div><hr><h2 id="内置组件排除列表" tabindex="-1">内置组件排除列表 <a class="header-anchor" href="#内置组件排除列表" aria-label="Permalink to &quot;内置组件排除列表&quot;">​</a></h2><p>以下名称是 Aether 内置组件，<strong>不会</strong>被识别为自定义组件：</p><table tabindex="0"><thead><tr><th>内置组件</th><th></th><th></th><th></th><th></th></tr></thead><tbody><tr><td>VStack</td><td>HStack</td><td>ZStack</td><td>Text</td><td>Button</td></tr><tr><td>Image</td><td>Icon</td><td>Rectangle</td><td>Select</td><td>Spacer</td></tr><tr><td>Divider</td><td>Grid</td><td>GridCell</td><td>ScrollView</td><td>Tab</td></tr><tr><td>Tabs</td><td>Stack</td><td>Routes</td><td>Drawer</td><td>Toast</td></tr><tr><td>Dialog</td><td>FileTree</td><td></td><td></td><td></td></tr></tbody></table><p>如果 <code>src/ui/components/</code> 目录下存在与内置组件同名的文件（如 <code>text.ae</code>），该文件将被忽略，内置组件优先。</p><hr><h2 id="完整项目示例" tabindex="-1">完整项目示例 <a class="header-anchor" href="#完整项目示例" aria-label="Permalink to &quot;完整项目示例&quot;">​</a></h2><h3 id="partition-manager-项目" tabindex="-1">partition-manager 项目 <a class="header-anchor" href="#partition-manager-项目" aria-label="Permalink to &quot;partition-manager 项目&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src/ui/</span></span>
<span class="line"><span>├── routes.ae</span></span>
<span class="line"><span>├── home.ae</span></span>
<span class="line"><span>└── components/</span></span>
<span class="line"><span>    ├── action_button.ae    → ActionButton</span></span>
<span class="line"><span>    ├── partition_card.ae   → PartitionCard</span></span>
<span class="line"><span>    ├── gap_divider.ae      → GapDivider</span></span>
<span class="line"><span>    └── select_field.ae     → SelectField</span></span></code></pre></div><p><code>action_button.ae</code> — 通用操作按钮：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component(icon, label, onClick, color=&quot;$colors.text&quot;, width=220) {</span></span>
<span class="line"><span>    Button(label onClick={onClick}) {</span></span>
<span class="line"><span>        HStack(spacing=8) {</span></span>
<span class="line"><span>            Icon(name={icon} size=16 color={color})</span></span>
<span class="line"><span>            Text({label} size=14 color={color})</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .pad(left=12 right=16 top=8 bottom=8)</span></span>
<span class="line"><span>        .bg(opacity=0)</span></span>
<span class="line"><span>        .border(color={color} width=1 radius=8)</span></span>
<span class="line"><span>        .w(width)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>partition_card.ae</code> — 分区信息卡片：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component(name, size, type, used) {</span></span>
<span class="line"><span>    VStack(spacing=8) {</span></span>
<span class="line"><span>        HStack(space=&quot;between&quot;) {</span></span>
<span class="line"><span>            Text({name} size=16 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>            Text({type} size=12 color=&quot;$colors.text_hint&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Progress(value={used} max=100 type=&quot;linear&quot;)</span></span>
<span class="line"><span>        Text({size} size=13 color=&quot;$colors.text_secondary&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .pad(16)</span></span>
<span class="line"><span>    .bg(&quot;$colors.surface&quot;)</span></span>
<span class="line"><span>    .radius(12)</span></span>
<span class="line"><span>    .shadow(size=2)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>home.ae</code> 中调用：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=16) {</span></span>
<span class="line"><span>    Text(&quot;磁盘分区&quot; size=20 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>    GapDivider(gap=12)</span></span>
<span class="line"><span>    For(data=viewModel.partitions) {</span></span>
<span class="line"><span>        PartitionCard(name=&quot;{p.name}&quot; size=&quot;{p.size}&quot; type=&quot;{p.type}&quot; used=&quot;{p.used_percent}&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    HStack(spacing=12) {</span></span>
<span class="line"><span>        ActionButton(icon=&quot;plus&quot; label=&quot;新建分区&quot; onClick={Home.on_create()})</span></span>
<span class="line"><span>        ActionButton(icon=&quot;trash&quot; label=&quot;删除&quot; onClick={Home.on_delete()} color=&quot;$colors.error&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.pad(20)</span></span></code></pre></div><h3 id="aetherstudio-项目" tabindex="-1">AetherStudio 项目 <a class="header-anchor" href="#aetherstudio-项目" aria-label="Permalink to &quot;AetherStudio 项目&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>src/ui/</span></span>
<span class="line"><span>├── routes.ae</span></span>
<span class="line"><span>├── drawers.ae</span></span>
<span class="line"><span>├── home.ae</span></span>
<span class="line"><span>├── components/</span></span>
<span class="line"><span>│   ├── project_navigator.ae  → ProjectNavigator</span></span>
<span class="line"><span>│   └── nav_section.ae        → NavSection</span></span>
<span class="line"><span>└── menu_drawer.ae</span></span></code></pre></div><p><code>project_navigator.ae</code> — 无名组件，文件名即组件名：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component() {</span></span>
<span class="line"><span>    VStack(spacing=0) {</span></span>
<span class="line"><span>        Text(&quot;PROJECT&quot; size=11 color=&quot;$colors.text_hint&quot; weight=&quot;semibold&quot;)</span></span>
<span class="line"><span>            .pad(left=16 top=8 bottom=4)</span></span>
<span class="line"><span>        FileTree(root=&quot;/src&quot; onSelect={Home.on_file_select()} filter=&quot;*.swift&quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .bg(&quot;$colors.surface&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>nav_section.ae</code> — 带参数的导航区段：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component(title, icon=&quot;folder&quot;) {</span></span>
<span class="line"><span>    VStack(spacing=4) {</span></span>
<span class="line"><span>        HStack(spacing=6) {</span></span>
<span class="line"><span>            Icon(name={icon} size=14 color=&quot;$colors.text_secondary&quot;)</span></span>
<span class="line"><span>            Text({title} size=12 color=&quot;$colors.text_secondary&quot; weight=&quot;semibold&quot;)</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .pad(left=16 top=8 bottom=2)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><code>home.ae</code> 中调用：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=0) {</span></span>
<span class="line"><span>    ProjectNavigator()</span></span>
<span class="line"><span>    NavSection(title=&quot;收藏&quot; icon=&quot;star&quot;)</span></span>
<span class="line"><span>    NavSection(title=&quot;最近&quot; icon=&quot;clock&quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.w(260)</span></span>
<span class="line"><span>.bg(&quot;$colors.sidebar&quot;)</span></span></code></pre></div>`,79)])])}const k=a(p,[["render",i]]);export{u as __pageData,k as default};

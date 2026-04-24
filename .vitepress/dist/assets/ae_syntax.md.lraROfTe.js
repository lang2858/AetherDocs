import{_ as s,o as n,c as e,ag as t}from"./chunks/framework.CAXxHpAX.js";const u=JSON.parse('{"title":"AE 语法基础","description":"","frontmatter":{},"headers":[],"relativePath":"ae/syntax.md","filePath":"ae/syntax.md","lastUpdated":null}'),p={name:"ae/syntax.md"};function o(l,a,i,c,d,r){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="ae-语法基础" tabindex="-1">AE 语法基础 <a class="header-anchor" href="#ae-语法基础" aria-label="Permalink to &quot;AE 语法基础&quot;">​</a></h1><p>AE（Aether Expression）是 Aether 框架的声明式 UI 描述语言，用于描述界面结构和交互逻辑。本章介绍 AE 的核心语法规则。</p><hr><h2 id="声明式组件语法" tabindex="-1">声明式组件语法 <a class="header-anchor" href="#声明式组件语法" aria-label="Permalink to &quot;声明式组件语法&quot;">​</a></h2><p>AE 使用声明式语法描述组件树，基本格式为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ComponentName(props) { children }</span></span></code></pre></div><ul><li>组件名大写开头（<code>VStack</code>、<code>Text</code>、<code>Button</code>）</li><li>属性写在括号 <code>()</code> 内</li><li>子组件写在花括号 <code>{}</code> 内</li><li>无子组件时可省略花括号</li></ul><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=12) {</span></span>
<span class="line"><span>    Text(&quot;标题&quot; size=20 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>    Text(&quot;正文内容&quot; size=14 color=&quot;#8A90A2&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h2 id="注释" tabindex="-1">注释 <a class="header-anchor" href="#注释" aria-label="Permalink to &quot;注释&quot;">​</a></h2><p>单行注释使用 <code>//</code>：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 这是一个注释</span></span>
<span class="line"><span>Text(&quot;Hello&quot;)</span></span>
<span class="line"><span>// Text(&quot;被注释掉的组件&quot;)</span></span></code></pre></div><hr><h2 id="点修饰符-dot-modifiers" tabindex="-1">点修饰符（Dot Modifiers） <a class="header-anchor" href="#点修饰符-dot-modifiers" aria-label="Permalink to &quot;点修饰符（Dot Modifiers）&quot;">​</a></h2><p>点修饰符以链式调用方式追加在组件后，用于设置样式、尺寸、间距等：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Text(&quot;Hello&quot;).size(14).color(&quot;#FFF&quot;).pad(8)</span></span></code></pre></div><p>修饰符可以连续链式调用，执行顺序从左到右：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Rectangle().w(6).h(32).bg(&quot;#1E2333&quot;).radius(3)</span></span></code></pre></div><hr><h2 id="text-内联属性" tabindex="-1">Text 内联属性 <a class="header-anchor" href="#text-内联属性" aria-label="Permalink to &quot;Text 内联属性&quot;">​</a></h2><p><code>Text</code> 组件支持在括号内直接书写属性，这是 AE 的特殊语法糖：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Text(&quot;内容&quot; size=14 color=&quot;#FFF&quot; weight=&quot;bold&quot;)</span></span></code></pre></div><p>等价于：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Text(&quot;内容&quot;).size(14).color(&quot;#FFF&quot;).bold()</span></span></code></pre></div><p>可用内联属性：<code>size</code>、<code>weight</code>、<code>color</code>、<code>numberFormat</code>、<code>decimalPlaces</code>、<code>prefix</code>、<code>suffix</code>、<code>autoScale</code>、<code>minScale</code>、<code>font</code>。</p><hr><h2 id="字符串值" tabindex="-1">字符串值 <a class="header-anchor" href="#字符串值" aria-label="Permalink to &quot;字符串值&quot;">​</a></h2><p>字符串值使用双引号包裹：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Text(&quot;Hello World&quot;)</span></span>
<span class="line"><span>Text(&quot;内容&quot; color=&quot;#FF0000&quot;)</span></span></code></pre></div><hr><h2 id="颜色引用" tabindex="-1">颜色引用 <a class="header-anchor" href="#颜色引用" aria-label="Permalink to &quot;颜色引用&quot;">​</a></h2><p>AE 支持三种颜色表示方式：</p><table tabindex="0"><thead><tr><th>格式</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td><code>&quot;#hex&quot;</code></td><td>十六进制颜色值</td><td><code>&quot;#121622&quot;</code>、<code>&quot;#FFF&quot;</code></td></tr><tr><td><code>$colors.token</code></td><td>主题颜色 Token 引用</td><td><code>$colors.primary</code>、<code>$colors.text</code></td></tr><tr><td><code>Color.xxx</code></td><td>SwiftUI 内置颜色名</td><td><code>Color.red</code>、<code>Color.blue</code></td></tr></tbody></table><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 十六进制</span></span>
<span class="line"><span>.bg(&quot;#121622&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 主题 Token</span></span>
<span class="line"><span>.bg($colors.primary)</span></span>
<span class="line"><span>.color($colors.text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 内置颜色</span></span>
<span class="line"><span>.color(Color.red)</span></span></code></pre></div><hr><h2 id="状态绑定" tabindex="-1">状态绑定 <a class="header-anchor" href="#状态绑定" aria-label="Permalink to &quot;状态绑定&quot;">​</a></h2><p>使用花括号 <code>{}</code> 包裹的状态绑定会自动映射到 ViewModel 的逻辑方法：</p><table tabindex="0"><thead><tr><th>AE 语法</th><th>SwiftUI 映射</th><th>说明</th></tr></thead><tbody><tr><td><code>{TypeName.field}</code></td><td><code>viewModel.logic.getXxx()</code></td><td>读取字段值</td></tr><tr><td><code>{TypeName.method()}</code></td><td><code>viewModel.logic.method()</code></td><td>调用方法</td></tr></tbody></table><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 读取状态</span></span>
<span class="line"><span>Text({Home.title})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 绑定可变状态</span></span>
<span class="line"><span>TextField(value={Home.search_text} placeholder=&quot;搜索&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用方法</span></span>
<span class="line"><span>Button(&quot;提交&quot; onClick={Home.submit()})</span></span></code></pre></div><hr><h2 id="事件绑定" tabindex="-1">事件绑定 <a class="header-anchor" href="#事件绑定" aria-label="Permalink to &quot;事件绑定&quot;">​</a></h2><p>事件绑定使用 <code>onXxx={TypeName.method()}</code> 语法：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Button(&quot;点击&quot; onClick={Home.on_click()})</span></span>
<span class="line"><span>View(onTap={Detail.show_menu()})</span></span>
<span class="line"><span>View(onLongPress={Detail.edit_mode()})</span></span>
<span class="line"><span>Toggle(value={Settings.dark_mode} onChange={Settings.toggle_dark()})</span></span></code></pre></div><hr><h2 id="主题引用" tabindex="-1">主题引用 <a class="header-anchor" href="#主题引用" aria-label="Permalink to &quot;主题引用&quot;">​</a></h2><p>AE 通过 <code>$</code> 前缀引用主题系统中的设计 Token：</p><table tabindex="0"><thead><tr><th>引用方式</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td><code>$colors.xxx</code></td><td>颜色 Token</td><td><code>$colors.primary</code>、<code>$colors.background</code></td></tr><tr><td><code>$typography.xxx</code></td><td>排版 Token</td><td><code>$typography.headline</code>、<code>$typography.body</code></td></tr><tr><td><code>$spacing.xxx</code></td><td>间距 Token</td><td><code>$spacing.md</code>、<code>$spacing.lg</code></td></tr><tr><td><code>$radius.xxx</code></td><td>圆角 Token</td><td><code>$radius.sm</code>、<code>$radius.md</code></td></tr></tbody></table><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=$spacing.md) {</span></span>
<span class="line"><span>    Text(&quot;标题&quot; size=$typography.headline)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>.bg($colors.background)</span></span>
<span class="line"><span>.radius($radius.md)</span></span></code></pre></div><hr><h2 id="资源引用" tabindex="-1">资源引用 <a class="header-anchor" href="#资源引用" aria-label="Permalink to &quot;资源引用&quot;">​</a></h2><p>使用 <code>$assets</code> 引用项目资源：</p><table tabindex="0"><thead><tr><th>引用方式</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td><code>$assets.xxx</code></td><td>静态资源引用</td><td><code>$assets.logo</code>、<code>$assets.banner</code></td></tr><tr><td><code>$assets.{param}</code></td><td>动态资源引用</td><td><code>$assets.{icon}</code></td></tr></tbody></table><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 静态资源</span></span>
<span class="line"><span>Image($assets.logo).w(32).h(32)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 动态资源（根据运行时变量决定）</span></span>
<span class="line"><span>Image($assets.{icon}).w(24).h(24)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 按钮图标</span></span>
<span class="line"><span>Button($assets.icon_add &quot;新建&quot; onClick={Home.create()})</span></span></code></pre></div><hr><h2 id="国际化引用" tabindex="-1">国际化引用 <a class="header-anchor" href="#国际化引用" aria-label="Permalink to &quot;国际化引用&quot;">​</a></h2><p>使用 <code>@i18n</code> 前缀引用国际化字符串：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Text(@i18n.home.title)</span></span>
<span class="line"><span>Button(@i18n.common.confirm onClick={Home.confirm()})</span></span></code></pre></div><p>格式为 <code>@i18n.章节.键名</code>，运行时根据当前语言环境自动选择对应翻译。</p><hr><h2 id="嵌套深度" tabindex="-1">嵌套深度 <a class="header-anchor" href="#嵌套深度" aria-label="Permalink to &quot;嵌套深度&quot;">​</a></h2><p>AE 组件嵌套深度无限制，可以任意层级组合：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ScrollView(.vertical) {</span></span>
<span class="line"><span>    VStack(spacing=16) {</span></span>
<span class="line"><span>        Card(title=&quot;用户信息&quot;) {</span></span>
<span class="line"><span>            HStack(spacing=12) {</span></span>
<span class="line"><span>                Avatar(src=$assets.avatar size=48)</span></span>
<span class="line"><span>                VStack(spacing=4) {</span></span>
<span class="line"><span>                    Text(&quot;张三&quot; size=16 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>                    Text(&quot;产品设计师&quot; size=13 color=&quot;#8A90A2&quot;)</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Section(title=&quot;设置&quot;) {</span></span>
<span class="line"><span>            Form {</span></span>
<span class="line"><span>                FormItem(label=&quot;通知&quot; required=true) {</span></span>
<span class="line"><span>                    Toggle(value={Settings.notify} onChange={Settings.toggle_notify()})</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .pad(16)</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h2 id="综合示例" tabindex="-1">综合示例 <a class="header-anchor" href="#综合示例" aria-label="Permalink to &quot;综合示例&quot;">​</a></h2><p>下面是一个完整示例，展示了多种语法特性的组合使用：</p><div class="language-ae vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ae</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VStack(spacing=$spacing.md) {</span></span>
<span class="line"><span>    // 头部</span></span>
<span class="line"><span>    HStack {</span></span>
<span class="line"><span>        Image($assets.logo).w(40).h(40)</span></span>
<span class="line"><span>        Text(@i18n.home.title size=20 weight=&quot;bold&quot;)</span></span>
<span class="line"><span>            .color($colors.text)</span></span>
<span class="line"><span>        Spacer()</span></span>
<span class="line"><span>        Icon(name=&quot;gearshape.fill&quot; size=20 color=$colors.secondary)</span></span>
<span class="line"><span>            .onTap({Home.open_settings()})</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .pad(16)</span></span>
<span class="line"><span>    .bg($colors.background)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 搜索栏</span></span>
<span class="line"><span>    SearchBar(value={Home.search_text} placeholder=@i18n.home.search)</span></span>
<span class="line"><span>        .pad(left=16, right=16)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 内容列表</span></span>
<span class="line"><span>    ScrollView(.vertical) {</span></span>
<span class="line"><span>        VStack(spacing=$spacing.sm) {</span></span>
<span class="line"><span>            Card(title={Item.name} subtitle={Item.desc} onClick={Item.open()})</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .pad(16)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    .flexGrow(1)</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,66)])])}const g=s(p,[["render",o]]);export{u as __pageData,g as default};

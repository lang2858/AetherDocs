---
layout: home

hero:
  name: Aether
  text: AI-Native Cross-Platform App Framework
  tagline: 一句话描述，全平台生成 — AI 只需输出 AE，框架自动生成原生代码
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/getting-started
    - theme: alt
      text: AE Syntax
      link: /guide/syntax

features:
  - title: AI-Friendly AE 语言
    icon: 🤖
    details: 简洁声明式语法，无样板代码；语义化组件一行即组件；声明即实现，AI 只需输出 AE 描述，框架自动生成 SwiftUI/Compose/WXML + 原生逻辑层
  - title: 自动状态绑定
    icon: 🔗
    details: $state 声明即绑定，自动生成 ViewModel + @Published；$logic.method() 调用 Rust 逻辑层，UniFFI 桥接原生；组件 props 自动传递
  - title: 全平台原生
    icon: ⚡
    details: macOS/iOS (SwiftUI) · Android (Compose) · Web (WASM) · 微信小程序 (WXML) · Backend (Rust，规划中)
---

<div style="text-align:center; padding: 12px 0 4px;">

| macOS | iOS | Android | Web | 微信小程序 | Backend |
|-------|-----|---------|-----|-----------|---------|
| ✅ SwiftUI | ✅ SwiftUI | 🔜 Compose | 🔜 WASM | 🔜 WXML | 🔜 Rust |

</div>

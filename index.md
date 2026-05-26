---
layout: home

hero:
  name: Aether
  text: 声明式跨平台原生应用框架
  tagline: 用 AE 描述 UI，Rust 实现逻辑，编译器生成 SwiftUI / Compose / WinUI / WASM 原生代码
  image:
    src: /logo.svg
    alt: Aether
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: AE 语法
      link: /ae/syntax
    - theme: alt
      text: GitHub
      link: https://github.com/aether-dev/aether

features:
  - title: 声明式 UI
    details: AE 标记语言描述界面 — 组件化、可复用、主题令牌化设计，写一次到处跑
  - title: 原生性能
    details: 静态转译为平台原生代码（SwiftUI / Jetpack Compose / WinUI / WASM），零运行时开销
  - title: Rust 逻辑层
    details: 业务逻辑用 Rust 编写，UniFFI 自动生成跨语言绑定，类型安全、内存安全
  - title: 编译器诊断
    details: 主题引用、无效属性在转译阶段即报错，附源码位置和错误码，无需等到原生编译
  - title: Apple 平台
    details: macOS · iOS · iPad — SwiftUI 原生，macOS 已在生产使用
  - title: Android 平台
    details: Jetpack Compose 原生，代码生成后端已就绪
  - title: Windows & Linux
    details: PyQt6 / WinUI 3 代码生成后端，Windows 已可用于生产
  - title: Web 平台
    details: WASM + HTML 代码生成，已可用于生产
  - title: HarmonyOS
    details: ArkUI 代码生成后端（规划中）
---

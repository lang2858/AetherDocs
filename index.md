---
layout: home

hero:
  name: Aether
  text: 一次编写，原生渲染，多平台一致
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: AE 语法
      link: /ae/display

features:
  - title: 原生性能，不是折中
    details: 生成 SwiftUI / Compose / ArkUI 原生代码，直接调用系统渲染管线。不是 WebView 套壳，不是跨端模拟——每一帧都是平台原生的流畅体验。
  - title: 一份源码，界面一致
    details: AI 用不同语言重写同一个应用，总会出现按钮错位、列表行为差异、动画不统一。Aether 从同一份 .ae + .rs 生成各平台原生代码，UI 行为和交互逻辑天然一致，不存在"翻译偏差"。
  - title: 不只是 App
    details: macOS / iPhone / iPad / Android / Windows / Linux / 鸿蒙 / Web，应用、工具、排版、原型——只要需要界面，Aether 都能生成。IDE 设计模式下甚至可以纯 UI 输出 PDF 和布局稿，不写一行 Rust 也能出活。
  - title: 声明式 .ae 语法
    details: 简洁直观的声明式 UI，链式修饰符风格，学习成本极低
  - title: Rust 业务逻辑
    details: 通过 UniFFI 桥接到原生平台，安全、高性能、零运行时开销
  - title: 按需代码生成
    details: 智能检测项目使用的能力，仅生成必要的 delegate 和框架依赖，最小化包体积
---

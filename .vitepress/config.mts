import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Aether 开发文档',
  description: 'Aether 跨平台应用框架 — 开发者参考手册',
  lang: 'zh-CN',
  base: '/AetherDocs/',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'AE 组件', link: '/ae/syntax' },
      { text: '自定义组件', link: '/components/custom-components' },
      { text: 'Logic 层', link: '/logic/overview' },
      { text: '主题 & i18n', link: '/theming/theme' },
      { text: '测试', link: '/guide/testing' },
      { text: '更新记录', link: '/changelog' },
    ],
    sidebar: {
      '/guide/': [
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '项目结构', link: '/guide/project-structure' },
        { text: '构建流水线', link: '/guide/build-pipeline' },
        { text: '配置参考', link: '/guide/config' },
        { text: '测试框架', link: '/guide/testing' },
      ],
      '/ae/': [
        { text: '响应式布局', link: '/ae/responsive' },
        { text: '语法基础', link: '/ae/syntax' },
        { text: '布局组件', link: '/ae/layout' },
        { text: '显示组件', link: '/ae/display' },
        { text: '输入组件', link: '/ae/input' },
        { text: '列表组件', link: '/ae/list' },
        { text: '导航', link: '/ae/navigation' },
        { text: '反馈组件', link: '/ae/feedback' },
        { text: '手势 & 动画', link: '/ae/gesture' },
        { text: '数据展示', link: '/ae/data' },
        { text: '媒体组件', link: '/ae/media' },
        { text: '控制流', link: '/ae/control-flow' },
        { text: '修饰符全表', link: '/ae/modifiers' },
        { text: '自定义组件', link: '/components/custom-components' },
      ],
      '/logic/': [
        { text: 'Logic 层概览', link: '/logic/overview' },
        { text: 'Rust 代码编写', link: '/logic/writing-rust' },
        { text: '状态同步机制', link: '/logic/state-sync' },
        { text: '状态绑定', link: '/logic/state-binding' },
        { text: '.ae 绑定语法', link: '/logic/binding' },
        { text: '跨模块引用', link: '/logic/cross-module' },
        { text: '原生库桥接', link: '/logic/native-bridge' },
        { text: '系统 API', link: '/logic/system-api' },
        { text: '常见问题', link: '/logic/faq' },
      ],
      '/theming/': [
        { text: '主题系统', link: '/theming/theme' },
        { text: '国际化', link: '/theming/i18n' },
        { text: '资源管理', link: '/assets/assets' },
      ],
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lang2858/AetherDocs' },
    ],
  },
})
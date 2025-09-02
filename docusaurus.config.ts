import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Curve Knowledge Hub',
  tagline: 'Everything you need to know about Curve',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs.curve.finance',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'curvefi', // Usually your GitHub org/user name.
  projectName: 'curve-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: 'Curve Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          to: 'user/introduction',
          label: 'Users',
          activeBasePath: '/user',
        },
        // {
          //   to: 'guides/intro',
          //   label: 'Guides',
          //   activeBasePath: '/guides',
          // },
        {
          href: 'https://docs.curve.finance/documentation-overview/',
          label: 'Developers',
        },
        {
          to: 'protocol/why-curve',
          label: 'Build On Curve',
          activeBasePath: '/protocol',
        },
        // {
        //   to: 'advanced/intro',
        //   label: 'Advanced',
        //   activeBasePath: '/advanced',
        // },
        {
          label: 'News',
          position: 'right',
          href: 'https://news.curve.finance/',
        },
        {
          href: 'https://github.com/curvefi',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://curve.finance/',
          position: 'right',
          className: 'header-curve-link',
          'aria-label': 'curve.finance',
        },
        {
          type: 'dropdown',
          label: 'Links',
          position: 'right',
          items: [
            {
              label: 'curve.finance',
              href: 'https://curve.finance',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/twUngQYz85'
            }
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs/user',
          routeBasePath: 'user',
          sidebarPath: './sidebars/sidebarUser.js',
          sidebarCollapsed: true,
          breadcrumbs: false,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'protocol',
        path: 'docs/protocol',
        routeBasePath: 'protocol',
        includeCurrentVersion: true,
        sidebarPath: './sidebars/sidebarProtocol.js',
        sidebarCollapsed: true,
        breadcrumbs: false,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    //[
    //  '@docusaurus/plugin-content-docs',
    //  {
    //    id: 'guides',
    //    path: 'docs/guides',
    //    routeBasePath: 'guides',
    //    includeCurrentVersion: true,
    //    sidebarPath: './sidebars/sidebarGuides.js',
    //    sidebarCollapsed: true,
    //    breadcrumbs: false,
    //  },
    //],
    // [
      // '@docusaurus/plugin-content-docs',
      // {
        // id: 'developer',
        // path: 'docs/developer',
        // routeBasePath: 'developer',
        // includeCurrentVersion: true,
        // sidebarPath: './sidebars/sidebarTechnicalDocs.js',
        // sidebarCollapsed: true,
        // breadcrumbs: false,
        // remarkPlugins: [math],
        // rehypePlugins: [katex],
      // },
    // ],
  ],

  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],
};

export default config;

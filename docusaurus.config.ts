import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const SITE_DOMAIN = 'knowledge.curve.finance';

const config: Config = {
  title: 'Curve Knowledge Hub',
  tagline: 'Everything you need to know about Curve',
  favicon: 'img/favicon.png',

  headTags: [
      {
        tagName: 'meta',
        attributes: {
          name: 'algolia-site-verification',
          content: '7413F5538D3EDA81',
        },
      },
    ],

  // Set the production url of your site here
  url: `https://${SITE_DOMAIN}`,
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

  themes: [
    '@docusaurus/theme-mermaid'],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    algolia: {
      // The application ID provided by Algolia
      appId: '0JUF43T81Z',
      // Public API key: it is safe to commit it
      apiKey: '924b8a275700d8f67826ed2ed67671bb',
      indexName: 'algolia branch',
      // Optional: see doc section below
      contextualSearch: true,
      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',
      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },
      // Optional: Algolia search parameters
      searchParameters: {},
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
      askAi: {
        assistantId: 'IYRY71AZnunB',
        indexName: 'markdown-index',
        apiKey: '924b8a275700d8f67826ed2ed67671bb',
        appId: '0JUF43T81Z',
      },
      translations: {
        button: {
          buttonText: 'Search & Ask AI',
          buttonAriaLabel: 'Search & Ask AI',
        },
        modal: {
          searchBox: {
            placeholderTextAskAi: 'Ask another question...',
            placeholderTextAskAiStreaming: 'Answering...',
          },
        },
      },
      placeholder: 'Search docs or ask AI a question',
    },
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
        {
          href: 'https://docs.curve.finance/documentation-overview/',
          label: 'Developers',
        },
        {
          to: 'protocol/why-curve',
          label: 'Build On Curve',
          activeBasePath: '/protocol',
        },
        {
          href: 'https://github.com/curvefi',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          label: 'Blog',
          position: 'right',
          href: 'https://news.curve.finance/',
        },
        {
          type: 'dropdown',
          label: 'Links',
          position: 'right',
          items: [
            {
              label: 'Curve',
              href: 'https://curve.finance',
              className: 'dropdown-item-with-icon',
              'data-icon': 'dapp',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/twUngQYz85',
              className: 'dropdown-item-with-icon',
              'data-icon': 'discord',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/curvefi',
              className: 'dropdown-item-with-icon',
              'data-icon': 'telegram',
            },
            {
              label: 'Twitter',
              href: 'https://x.com/curvefinance',
              className: 'dropdown-item-with-icon',
              'data-icon': 'twitter',
            },
            {
              label: 'Governance Forum',
              href: 'https://gov.curve.finance',
              className: 'dropdown-item-with-icon',
              'data-icon': 'forum',
            },
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
          admonitions: {
            keywords: ['note', 'tip', 'tip-green', 'info', 'caution', 'danger', 'example'],
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-plausible',
      {
        domain: SITE_DOMAIN,
      },
    ],
    function latestAnnouncement() {
      return {
        name: 'latest-announcement-client-module',
        getClientModules() {
          return [require.resolve('./src/clientModules/latestPopup.js')];
        },
      };
    },
    // Inject feedback endpoint to window; set to your Formspree Endpoint
    function feedbackEndpoint() {
      return {
        name: 'feedback-endpoint-runtime',
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: 'script',
                innerHTML: "window.__FEEDBACK_ENDPOINT__='https://formspree.io/f/xgvnlvzp';",
              },
            ],
          };
        },
      };
    },
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
        admonitions: {
          keywords: ['note', 'tip', 'tip-green', 'info', 'caution', 'danger', 'example'],
        },
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

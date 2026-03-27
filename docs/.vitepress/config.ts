import { defineConfig } from 'vitepress'

export default defineConfig({
  ignoreDeadLinks: true,
  base: '/docs/',
  title: "Kerus Docs",
  description: "Documentação Técnica do Gerador de Fórmulas Kerus",
  
  locales: {
    root: {
      label: 'Português',
      lang: 'pt-BR',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
    },
    es: {
      label: 'Español',
      lang: 'es-ES',
      link: '/es/',
    }
  },

  themeConfig: {
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Guia', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: [
      {
        text: 'Introdução',
        items: [
          { text: 'O que é o Kerus?', link: '/guide/' },
          { text: 'Primeiros Passos', link: '/guide/getting-started' },
          { text: 'Atualizações', link: '/guide/updates' },
        ]
      },
      {
        text: 'Funcionalidades',
        items: [
          { text: 'Fórmulas', link: '/guide/formulas' },
          { text: 'Orçamentos', link: '/guide/quotations' },
          { text: 'Tema Escuro', link: '/guide/theme' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/invent-software/kerus' }
    ],
    footer: {
      message: 'Lançado sob a Licença MIT.',
      copyright: 'Copyright © 2026-Presente Invent Software'
    }
  }
})

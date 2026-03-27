import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/docs/',
  ignoreDeadLinks: true,
  srcExclude: ['internal/**'],
  rewrites: {
    'languages/en/:rest*': 'en/:rest*',
    'languages/es/:rest*': 'es/:rest*'
  },

  title: "Kerus",
  description: "Documentação Oficial do Sistema Kerus",

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Pesquisar', buttonAriaLabel: 'Pesquisar' },
              modal: {
                noResultsText: 'Nenhum resultado para',
                resetButtonTitle: 'Limpar pesquisa',
                footer: { selectText: 'para selecionar', navigateText: 'para navegar', closeText: 'para fechar' }
              }
            }
          }
        }
      }
    }
  },

  locales: {
    root: {
      label: 'Português',
      lang: 'pt-BR',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/' },
          { text: 'Guia de Uso', link: '/guide/' },
        ],
        sidebar: [
          {
            text: 'Introdução',
            collapsed: false,
            items: [
              { text: 'O que é o Kerus?', link: '/guide/' },
              { text: 'Primeiros Passos', link: '/guide/getting-started' },
              { text: 'Atualizações', link: '/guide/updates' },
            ]
          },
          {
            text: 'Módulos do Sistema',
            collapsed: false,
            items: [
              { text: 'Fichas Técnicas', link: '/guide/sheet' },
              { text: 'Gestão de Orçamentos', link: '/guide/quotations' },
              { text: 'Controle de Estoque', link: '/guide/stock' },
            ]
          },
          {
            text: 'Sistema',
            collapsed: false,
            items: [
              { text: 'Configurações', link: '/guide/settings' },
              { text: 'Interface e Tema', link: '/guide/theme' },
            ]
          }
        ],
        outline: { label: 'Nesta página' },
        docFooter: { prev: 'Página anterior', next: 'Próxima página' },
        returnToTopLabel: 'Voltar ao topo',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Aparência',
        
        footer: {
          message: 'Documentação oficial para usuários Kerus.',
          copyright: 'Copyright © 2026 Invent Software'
        }
      }
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
  }
})
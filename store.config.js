module.exports = {
  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'accenturebb',
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
  },

  // Default channel
  session: {
    currency: {
      code: 'BRL',
      symbol: 'R$',
    },
    locale: 'pt-BR',
    channel: '{"salesChannel":"1","regionId":""}',
    country: 'BRA',
    postalCode: null,
    person: null,
  },

  // Production URLs
  storeUrl: 'https://accenturebb.vtex.app',
  secureSubdomain: 'https://accenturebb.vtexcommercestable.com.br',
  checkoutUrl: 'https://accenturebb.vtexcommercestable.com.br/checkout',
  loginUrl: 'https://accenturebb.vtexcommercestable.com.br/api/io/login',
  accountUrl: 'https://accenturebb.vtexcommercestable.com.br/api/io/account',

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:9000',
    pages: {
      home: '/',
      pdp: '/camisa-polo-masculina-l-12-12-1512/p',
      collection: '/masculino',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/camisa-polo-masculina-l-12-12-1512/p',
      collection: '/masculino',
      collection_filtered:
        '/masculino/?category-1=masculino&brand=lacoste&tamanho=4---m&facets=category-1%2Cbrand%2Ctamanho&sort=score_desc&page=0',
      search: '/s/?q=camiseta',
    },
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: 'GTM-PGHZ95N',
  },
}

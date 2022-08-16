module.exports = {
  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'accenturebb',
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
    country: 'BR',
    postalCode: null,
    person: null,
  },

  // Production URLs
  storeUrl: 'https://accenturebb.myvtex.com',
  secureSubdomain: 'https://accenturebb.myvtex.com',
  checkoutUrl: 'https://accenturebb.myvtex.com/checkout',
  loginUrl: 'https://accenturebb.myvtex.com/api/io/login',
  accountUrl: 'https://accenturebb.myvtex.com/api/io/account',

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:9000',
    pages: {
      home: '/',
      pdp: '/iphone-13-apple--128gb--meia-noite-tela-de-61--5g-e-camera-dupla-de-12-mp-202-1500/p',
      collection: '/eletronicos',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/iphone-13-apple--128gb--meia-noite-tela-de-61--5g-e-camera-dupla-de-12-mp-202-1500/p',
      collection: '/eletronicos',
      collection_filtered:
        'eletronicos/?category-1=eletronicos&brand=apple&facets=category-1%2Cbrand&sort=score_desc&page=0',
      search: '/s?q=iphone',
    },
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: 'GTM-PGHZ95N',
  },
}

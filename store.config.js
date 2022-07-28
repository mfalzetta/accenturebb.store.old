module.exports = {
  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: 'accenturebb',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
  },

  // Default channel
  channel: '{"salesChannel":"1","regionId":""}',
  locale: 'en-US',

  // Production URLs
  storeUrl: 'https://faststore.kyroz.io',
  secureSubdomain: 'https://secure.faststore.kyroz.io',
  checkoutUrl: 'https://secure.faststore.kyroz.io/checkout',
  loginUrl: 'https://secure.faststore.kyroz.io/api/io/login',
  accountUrl: 'https://secure.faststore.kyroz.io/api/io/account',

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

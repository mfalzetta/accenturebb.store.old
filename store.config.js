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
  channel: '{"salesChannel":"1"}',

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
      pdp: '/apple-magic-mouse-99988212/p',
      collection: '/office',
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: '/apple-magic-mouse-99988212/p',
      collection: '/office',
      collection_filtered:
        '/office/?category-1=office&marca=acer&facets=category-1%2Cmarca',
      search: '/s?q=orange',
    },
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: 'GTM-PGHZ95N',
  },
}

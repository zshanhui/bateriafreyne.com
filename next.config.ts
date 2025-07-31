
export default {
  env: {
    NEXT_PUBLIC_URL: 'http://bateriafreyne.local'
  },
  experimental: {
    ppr: false,
    inlineCss: true,
    useCache: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'soppaekplyccyhrfkauf.supabase.co',
        pathname: '/storage/v1/object/public/manufacturers/**'
      }
    ]
  }
};

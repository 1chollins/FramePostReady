/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['apify-client', 'proxy-agent', 'got-scraping'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.zillow.com',
      },
      {
        protocol: 'https',
        hostname: '**.zillowstatic.com',
      },
    ],
  },
}

module.exports = nextConfig

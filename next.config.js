/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  typescript: {
    // Enables TypeScript strict mode
    strict: true,
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig

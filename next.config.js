/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fallback DATABASE_URL for Railway (internal network)
  // Railway's env var injection isn't reaching the runtime,
  // so we set it here as a build-time fallback
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:GynqYICVfLytHRzZZclxuTHntliKYylK@postgres.railway.internal:5432/railway',
  },
  images: {
    domains: [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

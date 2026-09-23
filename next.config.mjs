import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/school-data/manifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/maktab-profili',
        destination: '/school-profile',
        permanent: true,
      },
      {
        source: '/maktab-profili/',
        destination: '/school-profile',
        permanent: true,
      },
      {
        source: '/haqimizda',
        destination: '/maktab-haqida',
        permanent: true,
      },
      {
        source: '/pedagoglar',
        destination: '/oqituvchilar',
        permanent: true,
      },
      {
        source: '/yangiliklar-va-elonlar',
        destination: '/yangiliklar',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)

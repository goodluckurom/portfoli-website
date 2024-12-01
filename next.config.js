/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@uploadthing/react'],
  },
  webpack: (config, { isServer }) => {
    // Optimize build traces
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic'
    }
    return config
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig

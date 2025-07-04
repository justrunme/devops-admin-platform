/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: 'http://api:8080/health',
      },
    ];
  },
};

module.exports = nextConfig;
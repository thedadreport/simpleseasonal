/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vercel.blob.core.windows.net'],
  },
  allowedDevOrigins: ['192.168.60.94'],
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
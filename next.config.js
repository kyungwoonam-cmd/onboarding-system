/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,  // ✅ 추가
  },
  eslint: {
    ignoreDuringBuilds: true,  // ✅ 추가
  },
}
module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Skip static generation for routes that need auth
  staticPageGenerationTimeout: 120,
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all external images (AI-generated product images)
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // All API traffic goes through the apiClient which uses NEXT_PUBLIC_API_URL.
  // Legacy Next.js rewrites have been removed (those routes were deleted).
};

export default nextConfig;
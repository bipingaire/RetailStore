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
  // Proxy /api/* to the backend so subdomain frontends (e.g. highpoint.indumart.us)
  // can call /api/... on their own origin — avoiding CORS entirely.
  async rewrites() {
    // In Docker: BACKEND_INTERNAL_URL=http://backend:3001
    // In local dev: defaults to localhost:3001
    const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
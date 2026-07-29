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
    return {
      beforeFiles: [
        {
          source: '/api/auth/login',
          destination: `${backendUrl}/api/auth/login`,
        },
        {
          source: '/api/auth/register',
          destination: `${backendUrl}/api/auth/register`,
        },
        {
          source: '/api/auth/google-login',
          destination: `${backendUrl}/api/auth/google-login`,
        },
        {
          source: '/api/auth/super-admin/login',
          destination: `${backendUrl}/api/auth/super-admin/login`,
        },
        {
          source: '/api/auth/login-owner',
          destination: `${backendUrl}/api/auth/login-owner`,
        },
        {
          source: '/api/auth/register-owner',
          destination: `${backendUrl}/api/auth/register-owner`,
        },
        {
          source: '/api/auth/forgot-password',
          destination: `${backendUrl}/api/auth/forgot-password`,
        },
        {
          source: '/api/auth/reset-password',
          destination: `${backendUrl}/api/auth/reset-password`,
        },
        {
          source: '/api/auth/profile',
          destination: `${backendUrl}/api/auth/profile`,
        },
      ],
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
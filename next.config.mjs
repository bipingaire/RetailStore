/** @type {import('next').NextConfig} */
const nextConfig = {
  // We will likely add image domain config here later for the AI images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Temporarily allow all external images for the prototype
      },
    ],
  },
};

export default nextConfig;
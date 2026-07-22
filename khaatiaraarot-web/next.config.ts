import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // port: '', // optional, defaults to 80/443
        // pathname: '/o05nqdvk/**', // optional: restrict to only YOUR specific cloud folder
      },
    ],
  },
};

export default nextConfig;

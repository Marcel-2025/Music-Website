/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co", // Spotify images
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com", // YouTube channel images
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube video thumbnails
      },
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com", // Apple Music images
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // Amazon Music images
      },
      {
        protocol: "https",
        hostname: "blob.v0.dev", // v0 placeholder images
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Generic placeholder images
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;

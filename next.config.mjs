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
        hostname: "i.ytimg.com", // YouTube images
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
        protocol: "http",
        hostname: "localhost", // For local placeholder images
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Generic placeholder images
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Another generic placeholder
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig

import type { NextConfig } from "next"

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    })
    return config
  },
  images: {
    // ✅ Add support for data URI (base64)
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // ✅ Disable optimization for data URIs
    unoptimized: process.env.NODE_ENV === "development",
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Optimiert für Cloudflare Pages
  // output: 'standalone', // Optional: für bessere Performance, aber kann Probleme mit Cloudflare verursachen
}

module.exports = nextConfig

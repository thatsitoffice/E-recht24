/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions sind jetzt standardmäßig aktiviert, experimental.serverActions wurde entfernt
  // Optimiert für Cloudflare Pages
  // output: 'standalone', // Optional: für bessere Performance, aber kann Probleme mit Cloudflare verursachen
}

module.exports = nextConfig

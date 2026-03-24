/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export para Capacitor (APK)
  // Comenta 'output' si usas Vercel (no necesita export estático)
  // output: 'export',

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Para export estático con Capacitor, se necesita unoptimized
    // unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;

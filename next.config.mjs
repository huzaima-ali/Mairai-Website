/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    const hubs = [
      { code: "us", dest: "/regions/united-states" },
      { code: "uk", dest: "/regions/united-kingdom" },
      { code: "mena", dest: "/regions/middle-east" },
    ];
    return hubs.flatMap(({ code, dest }) => [
      { source: `/${code}`, destination: dest, permanent: true },
      { source: `/${code}/landing`, destination: dest, permanent: true },
      { source: `/${code}/:kind/:slug`, destination: `${dest}/:slug`, permanent: true },
    ]);
  },
};

export default nextConfig;

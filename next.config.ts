import type { NextConfig } from "next";

// One canonical host: www.domain ↔ domain is redirected (301) to the host in NEXT_PUBLIC_SITE_URL.
const siteHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? '').hostname;
  } catch {
    return '';
  }
})();
const aliasHost = !siteHost || siteHost === 'localhost' || /^\d+(\.\d+){3}$/.test(siteHost)
  ? null
  : siteHost.startsWith('www.') ? siteHost.slice(4) : `www.${siteHost}`;

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    if (!aliasHost) return [];
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: aliasHost }],
        destination: `${process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/+$/, '')}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;

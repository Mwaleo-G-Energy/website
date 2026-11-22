/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "people.pic1.co" },
      { protocol: "https", hostname: "app-uploads-cdn.fera.ai" },
    ],
  },

  // The old /list address goes to /shop for good, and the category or search in the address goes with it. /shop then sends
  // a ?cat= address on to the category's own page, /shop/<category>.
  async redirects() {
    return [
      { source: "/list", destination: "/shop", permanent: true },
      { source: "/gift-vouchers", destination: "/shop", permanent: false },
      { source: "/return-policy", destination: "/contact", permanent: false },
    ];
  },

};

export default nextConfig;
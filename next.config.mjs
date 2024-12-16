/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/signin",
        destination: "http://localhost:3000/api/auth/signin", // The :path parameter isn't used here so will be automatically passed in the query
      },
      {
        source: "/signout",
        destination: "http://localhost:3000/api/auth/signout", // The :path parameter isn't used here so will be automatically passed in the query
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.requestly.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

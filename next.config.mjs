/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/questions",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

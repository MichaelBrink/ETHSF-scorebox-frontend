/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ENV_CONFIG: process.env.ENV_CONFIG,
  },
};

module.exports = nextConfig

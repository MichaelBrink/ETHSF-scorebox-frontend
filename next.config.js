/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ENV_CONFIG: process.env.ENV_CONFIG,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    COINMARKET_KEY: process.env.COINMARKET_KEY,
    SCORE_CONTRACT_NAME: process.env.SCORE_CONTRACT_NAME,
  },
};

module.exports = nextConfig

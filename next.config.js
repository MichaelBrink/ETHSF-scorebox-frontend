/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_BASE_URL: process.env.NEXT_BASE_URL,
    ENV_CONFIG: process.env.ENV_CONFIG,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    COINMARKET_KEY: process.env.COINMARKET_KEY,
    SCORE_CONTRACT_NAME: process.env.SCORE_CONTRACT_NAME,
    CONTRACT_OWNER_ID: process.env.CONTRACT_OWNER_ID,
    POLYGON_SCORE_CONTRACT_ADDRESS: process.env.POLYGON_SCORE_CONTRACT_ADDRESS,
    POLYGON_SCORE_ADMIN_PRIVATE_KEY:
      process.env.POLYGON_SCORE_ADMIN_PRIVATE_KEY,
    POLYGON_SCORE_BENEFICIARY_ADDRESS:
      process.env.POLYGON_SCORE_BENEFICIARY_ADDRESS,
    POLYGONSCAN_URL: process.env.POLYGONSCAN_URL,
  },
};

module.exports = nextConfig

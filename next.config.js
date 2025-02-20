module.exports = {
  swcMinify: true,
  env: {
    INFURA_API: process.env.INFURA_API,
    INFURA_IPFS_ID: process.env.INFURA_IPFS_ID,
    INFURA_IPFS_SECRET: process.env.INFURA_IPFS_SECRET,
    INFURA_IPFS_DOMAIN: process.env.INFURA_IPFS_DOMAIN,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    MUMBAI_URL: process.env.MUMBAI_URL,
    MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        path: false,
        stream: false,
        crypto: false,
        http: false,
        https: false,
      };
    }
    return config;
  },
}
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
  // Add webpack config here
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // These polyfills are needed for web3 libraries
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: false,
        assert: require.resolve('assert'),
        zlib: require.resolve('browserify-zlib'),
        url: require.resolve('url'),
        querystring: require.resolve('querystring-es3'),
      };
      
      // Add buffer polyfill
      config.resolve.alias = {
        ...config.resolve.alias,
        'buffer': 'buffer',
      };

      // Add plugins for buffer support
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      );
    }
    return config;
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
}
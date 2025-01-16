require('dotenv').config();

require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');

const { MUMBAI_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: '0.8.4',
  networks: {
    hardhat: {},
    polygonAmoy: {
      url: MUMBAI_URL, // Chainstack endpoint for Polygon Amoy
      accounts: [PRIVATE_KEY], // Your wallet private key
      chainId: 80002, // Chain ID for Polygon Amoy
    },
  },
};

module.exports = {
  solidity: '0.8.4',
  networks: {
    hardhat: {
      chainId: 31337, // Hardhat Network's default chainId
    },
    localhost: {
      url: 'http://127.0.0.1:8545', // Localhost RPC URL
      chainId: 31337, // Same as Hardhat Network
    },
  },
};

// task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// module.exports = {
//   solidity: '0.8.4',
//   networks: {
//     mumbai: {
//       url:
//         process.env.MUMBAI_URL ||
//         '',
//       accounts:
//         process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
//   gasReporter: {
//     enabled: process.env.REPORT_GAS !== undefined,
//     currency: 'USD',
//   },
//   etherscan: {
//     apiKey: process.env.POLYSCAN_API_KEY,
//   },
// };

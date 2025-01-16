// import { useCallback, useEffect, useReducer, useState } from 'react';
// import { IconButton } from '@mui/material';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import Account from './components/Account';

// import { ellipseAddress, getChainData } from './lib/utilities';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import { providers } from 'ethers';
// import WalletLink from '@coinbase/wallet-sdk';
// import Web3Modal from 'web3modal';

// const providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider, // required
//     package: WalletLink,
//     connector: async (_, options) => {
//       const { appName, networkUrl, chainId } = options;
//       const walletLink = new WalletLink({
//         appName,
//       });
//       const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
//       await provider.enable();
//       return provider;
//     },
//   },
// };

// let web3Modal;
// if (typeof window !== 'undefined') {
//   web3Modal = new Web3Modal({
//     network: 'mainnet', // optional
//     cacheProvider: true,
//     providerOptions, // required
//   });
// }

// const initialState = {
//   provider: null,
//   web3Provider: null,
//   address: null,
//   chainId: null,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_WEB3_PROVIDER':
//       return {
//         ...state,
//         provider: action.provider,
//         web3Provider: action.web3Provider,
//         address: action.address,
//         chainId: action.chainId,
//       };
//     case 'SET_ADDRESS':
//       return {
//         ...state,
//         address: action.address,
//       };
//     case 'SET_CHAIN_ID':
//       return {
//         ...state,
//         chainId: action.chainId,
//       };
//     case 'RESET_WEB3_PROVIDER':
//       return initialState;
//     default:
//       throw new Error();
//   }
// }

// export const Login = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { provider, web3Provider, address, chainId } = state;

//   const connect = useCallback(async function () {
//     // This is the initial `provider` that is returned when
//     // using web3Modal to connect. Can be MetaMask or WalletConnect.
//     const provider = await web3Modal.connect();

//     // We plug the initial `provider` into ethers.js and get back
//     // a Web3Provider. This will add on methods from ethers.js and
//     // event listeners such as `.on()` will be different.
//     const web3Provider = new providers.Web3Provider(provider);

//     const signer = web3Provider.getSigner();
//     const address = await signer.getAddress();

//     const network = await web3Provider.getNetwork();

//     dispatch({
//       type: 'SET_WEB3_PROVIDER',
//       provider,
//       web3Provider,
//       address,
//       chainId: network.chainId,
//     });
//   }, []);

//   const disconnect = useCallback(
//     async function () {
//       await web3Modal.clearCachedProvider();
//       if (provider?.disconnect && typeof provider.disconnect === 'function') {
//         await provider.disconnect();
//       }
//       dispatch({
//         type: 'RESET_WEB3_PROVIDER',
//       });
//       setAnchorEl(null);
//     },
//     [provider],
//   );

//   // Auto connect to the cached provider
//   useEffect(() => {
//     if (web3Modal.cachedProvider) {
//       connect();
//     }
//   }, [connect]);

//   // A `provider` should come with EIP-1193 events. We'll listen for those events
//   // here so that when a user switches accounts or networks, we can update the
//   // local React state with that new information.
//   useEffect(() => {
//     if (provider?.on) {
//       const handleAccountsChanged = (accounts) => {
//         // eslint-disable-next-line no-console
//         console.log('accountsChanged', accounts);
//         dispatch({
//           type: 'SET_ADDRESS',
//           address: accounts[0],
//         });
//       };

//       // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
//       const handleChainChanged = (_hexChainId) => {
//         window.location.reload();
//       };

//       const handleDisconnect = (error) => {
//         // eslint-disable-next-line no-console
//         console.log('disconnect', error);
//         disconnect();
//       };

//       provider.on('accountsChanged', handleAccountsChanged);
//       provider.on('chainChanged', handleChainChanged);
//       provider.on('disconnect', handleDisconnect);

//       // Subscription Cleanup
//       return () => {
//         if (provider.removeListener) {
//           provider.removeListener('accountsChanged', handleAccountsChanged);
//           provider.removeListener('chainChanged', handleChainChanged);
//           provider.removeListener('disconnect', handleDisconnect);
//         }
//       };
//     }
//   }, [provider, disconnect]);

//   const chainData = getChainData(chainId);

//   return (
//     <div className="container">
//       {web3Provider ? (
//         <Account
//           icon={`https://api.dicebear.com/5.x/identicon/svg?seed=${address}`}
//           address={ellipseAddress(address)}
//           handleLogout={disconnect}
//         />
//       ) : (
//         <IconButton color="primary" onClick={connect} size="medium">
//           <AccountBalanceWalletIcon fontSize="large" />
//         </IconButton>
//       )}
//     </div>
//   );
// };

// export default Login;
// import React, { useCallback, useEffect, useReducer, useState } from 'react';
// import { IconButton } from '@mui/material';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import Account from './components/Account';

// import { ellipseAddress, getChainData } from './lib/utilities';
// import { providers } from 'ethers';
// import Web3Modal from 'web3modal';

// const providerOptions = {
//   // No need for WalletConnect or WalletLink for localhost
// };

// let web3Modal;
// if (typeof window !== 'undefined') {
//   web3Modal = new Web3Modal({
//     // network: 'localhost', // Set to localhost
//     network: 'amoy', 
//     cacheProvider: true,
//     providerOptions, // Minimal provider options
//   });
// }

// const initialState = {
//   provider: null,
//   web3Provider: null,
//   address: null,
//   chainId: null,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_WEB3_PROVIDER':
//       return {
//         ...state,
//         provider: action.provider,
//         web3Provider: action.web3Provider,
//         address: action.address,
//         chainId: action.chainId,
//       };
//     case 'SET_ADDRESS':
//       return {
//         ...state,
//         address: action.address,
//       };
//     case 'SET_CHAIN_ID':
//       return {
//         ...state,
//         chainId: action.chainId,
//       };
//     case 'RESET_WEB3_PROVIDER':
//       return initialState;
//     default:
//       throw new Error();
//   }
// }

// export const Login = () => {
//   const [anchorEl, setAnchorEl] = useState(null); // Fix typo here
//   const open = Boolean(anchorEl);
//   const [state, dispatch] = useReducer(reducer, initialState); // Fix useReducer usage
//   const { provider, web3Provider, address, chainId } = state;

//   const switchToLocalhost = async () => {
//     if (window.ethereum) {
//       const chainId = 31337; // Chain ID for localhost
//       const chainData = getChainData(chainId);

//       try {
//         await window.ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: `0x${chainId.toString(16)}` }], // Convert chainId to hexadecimal
//         });
//       } catch (error) {
//         if (error.code === 4902) {
//           // Network not added to MetaMask, add it
//           await window.ethereum.request({
//             method: 'wallet_addEthereumChain',
//             params: [chainData],
//           });
//         } else {
//           console.error('Failed to switch network:', error);
//         }
//       }
//     } else {
//       alert('MetaMask is not installed');
//     }
//   };

//   const connect = useCallback(async function () {
//     // Switch to localhost network
//     await switchToLocalhost();

//     // Connect to the provider
//     const provider = await web3Modal.connect();
//     const web3Provider = new providers.Web3Provider(provider);

//     const signer = web3Provider.getSigner();
//     const address = await signer.getAddress();

//     const network = await web3Provider.getNetwork();

//     dispatch({
//       type: 'SET_WEB3_PROVIDER',
//       provider,
//       web3Provider,
//       address,
//       chainId: network.chainId,
//     });
//   }, []);

//   const disconnect = useCallback(
//     async function () {
//       await web3Modal.clearCachedProvider();
//       if (provider?.disconnect && typeof provider.disconnect === 'function') {
//         await provider.disconnect();
//       }
//       dispatch({
//         type: 'RESET_WEB3_PROVIDER',
//       });
//       setAnchorEl(null);
//     },
//     [provider],
//   );

//   // Auto connect to the cached provider
//   useEffect(() => {
//     if (web3Modal.cachedProvider) {
//       connect();
//     }
//   }, [connect]);

//   // A `provider` should come with EIP-1193 events. We'll listen for those events
//   // here so that when a user switches accounts or networks, we can update the
//   // local React state with that new information.
//   useEffect(() => {
//     if (provider?.on) {
//       const handleAccountsChanged = (accounts) => {
//         // eslint-disable-next-line no-console
//         console.log('accountsChanged', accounts);
//         dispatch({
//           type: 'SET_ADDRESS',
//           address: accounts[0],
//         });
//       };

//       const handleChainChanged = (_hexChainId) => {
//         const newChainId = parseInt(_hexChainId, 16); // Convert hex chainId to decimal
//         if (newChainId !== 31337) {
//           alert('Please switch to the localhost network (Chain ID: 31337)');
//           window.location.reload();
//         }
//       };

//       const handleDisconnect = (error) => {
//         // eslint-disable-next-line no-console
//         console.log('disconnect', error);
//         disconnect();
//       };

//       provider.on('accountsChanged', handleAccountsChanged);
//       provider.on('chainChanged', handleChainChanged);
//       provider.on('disconnect', handleDisconnect);

//       // Subscription Cleanup
//       return () => {
//         if (provider.removeListener) {
//           provider.removeListener('accountsChanged', handleAccountsChanged);
//           provider.removeListener('chainChanged', handleChainChanged);
//           provider.removeListener('disconnect', handleDisconnect);
//         }
//       };
//     }
//   }, [provider, disconnect]);

//   const chainData = chainId ? getChainData(chainId) : null;

//   return (
//     <div className="container">
//       {web3Provider ? (
//         <Account
//           icon={`https://api.dicebear.com/5.x/identicon/svg?seed=${address}`}
//           address={ellipseAddress(address)}
//           handleLogout={disconnect}
//         />
//       ) : (
//         <IconButton color="primary" onClick={connect} size="medium">
//           <AccountBalanceWalletIcon fontSize="large" />
//         </IconButton>
//       )}
//     </div>
//   );
// };

// export default Login;

//amoy
import { useCallback, useEffect, useReducer, useState } from 'react';
import { IconButton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Account from './components/Account';

import { ellipseAddress, getChainData } from './lib/utilities';
import { providers } from 'ethers';
import Web3Modal from 'web3modal';

const providerOptions = {
  // No need for WalletConnect or WalletLink for localhost
};

let web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'amoy', // Set to Polygon Amoy
    cacheProvider: true,
    providerOptions, // Minimal provider options
  });
}

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      };
    case 'RESET_WEB3_PROVIDER':
      return initialState;
    default:
      throw new Error();
  }
}

export const Login = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, address, chainId } = state;

  const switchToPolygonAmoy = async () => {
    if (window.ethereum) {
      const chainId = 80002; // Chain ID for Polygon Amoy
      const chainData = getChainData(chainId);

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }], // Convert chainId to hexadecimal
        });
      } catch (error) {
        if (error.code === 4902) {
          // Network not added to MetaMask, add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainData],
          });
        } else {
          console.error('Failed to switch network:', error);
        }
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  const connect = useCallback(async function () {
    // Switch to Polygon Amoy network
    await switchToPolygonAmoy();

    // Connect to the provider
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    const network = await web3Provider.getNetwork();

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      });
      setAnchorEl(null);
    },
    [provider],
  );

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts);
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId) => {
        const newChainId = parseInt(_hexChainId, 16); // Convert hex chainId to decimal
        if (newChainId !== 80002) {
          alert('Please switch to the Polygon Amoy Testnet (Chain ID: 80002)');
          window.location.reload();
        }
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const chainData = chainId ? getChainData(chainId) : null;

  return (
    <div className="container">
      {web3Provider ? (
        <Account
          icon={`https://api.dicebear.com/5.x/identicon/svg?seed=${address}`}
          address={ellipseAddress(address)}
          handleLogout={disconnect}
        />
      ) : (
        <IconButton color="primary" onClick={connect} size="medium">
          <AccountBalanceWalletIcon fontSize="large" />
        </IconButton>
      )}
    </div>
  );
};

export default Login;
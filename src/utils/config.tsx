import { keyStores } from 'near-api-js';

// Function that returns a NEAR connection configuration object based on the given environment.
export const getConfig = (environment: string) => {
  const handleKeyStore = () => {
    if (typeof window !== 'undefined') {
      return new keyStores.BrowserLocalStorageKeyStore();
    }
  };

  switch (environment) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        keyStore: handleKeyStore(),
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        headers: {},
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        keyStore: handleKeyStore(),
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        headers: {},
      };
    case 'testnet':
    default:
      return {
        networkId: 'testnet',
        keyStore: handleKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        headers: {},
      };
  }
};

export default getConfig;

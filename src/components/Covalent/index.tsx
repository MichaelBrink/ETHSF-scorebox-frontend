import detectEthereumProvider from '@metamask/detect-provider';
import { notification } from 'antd';
import { useScoreContext } from '@scorebox/src/context';
import { useEffect, useState } from 'react';
import { NextRouter } from 'next/router';

const Covalent = ({
  setToWaiting,
  setNotWaiting,
  router,
  chainId,
}: {
  router: NextRouter;
  setToWaiting: () => void;
  setNotWaiting: () => void;
  chainId: number;
}) => {
  const [ethAccount, setEthAccount] = useState<string | null>(null);
  const { setScoreResponse } = useScoreContext();

  useEffect(() => {
    handleMetamask();
  }, [ethAccount]);

  const handleMetamask = async () => {
    setToWaiting();
    const provider: any = await detectEthereumProvider();

    if (typeof window.ethereum !== 'undefined' && provider) {
      const accounts = await provider?.request({ method: 'eth_accounts' });
      const account = accounts[0];

      if (account) {
        setToWaiting();
        // Calculate the score with the ETH address retrievd from the metamask wallet
        try {
          const covalentRes = await fetch(`/api/covalent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              loan_request: 500,
              eth_address: account,
              chainId: chainId,
            }),
          });
          const { covalentScore } = await covalentRes.json();
          console.log(covalentScore);
          if (covalentScore.score) {
            setScoreResponse(covalentScore);
            router.replace('/applicant/generate?type=covalent&status=success');
          } else {
            notification.error({
              message: `There was an error. Please re-connect to covalent.`,
            });

            setNotWaiting();

            router.replace('/applicant/generate');
          }
        } catch (error) {
          console.log(error);
          notification.error({ message: 'Error connecting covalent' });
          setNotWaiting();
        }
      } else {
        setToWaiting();
        provider
          .request({ method: 'eth_requestAccounts' })
          .then(setNotWaiting());
      }
    } else {
      notification.error({ message: 'Please install Metamask to proceed.' });
      setNotWaiting();
    }
    provider?.on('chainChanged', handleChainChanged);
    provider?.on('accountsChanged', handleAccountsChanged);
  };

  let currentAccount: string | null = null;
  function handleChainChanged(_chainId: string) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
    notification.info({ message: 'Chain changed!' });
  }

  function handleAccountsChanged(accounts: Array<string>) {
    setEthAccount(accounts[0]);
    notification.info({
      message: 'Metamask account updated.',
    });
    if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
    }
  }

  return null;
};

export default Covalent;

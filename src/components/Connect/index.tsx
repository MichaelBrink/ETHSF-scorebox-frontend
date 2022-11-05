import {
  CopyOutlined,
  DisconnectOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

import truncateEthAddress from 'truncate-eth-address';
import { Tooltip } from 'antd';
import { useScoreContext } from '@scorebox/src/context';

export default function Connect() {
  const {
    account,
    connection,
    handleNearSignIn,
    handleMetaMask,
    handleSignOut,
    isConnected,
  } = useScoreContext();

  const [showOverlay, setShowOverlay] = useState(false);

  const WalletConnectOverlay = () => {
    return (
      <div
        className='absolute mt-3 border rounded-md right-0 flex flex-col justify-center bg-white drop-shadow'
        style={{ width: '300px', zIndex: 100 }}
      >
        <div
          style={{ height: '60px' }}
          className='flex items-center font-medium border-b px-5 bg-white hover:bg-gray-100 cursor-pointer'
          onClick={handleMetaMask}
        >
          <img
            className='w-8 mr-3'
            src='/images/metamask_logo.png'
            alt='metamask-logo'
          />
          MetaMask
        </div>
        <div
          style={{ height: '60px' }}
          className='flex items-center font-medium px-5 bg-white hover:bg-gray-100 cursor-pointer'
          onClick={handleNearSignIn}
        >
          <img
            className='w-8 mr-3'
            src='/images/near-logo.svg'
            alt='near-logo'
          />
          NEAR Wallet
        </div>
      </div>
    );
  };

  const WalletDetailsOverlay = () => {
    return (
      <div
        className='absolute mt-3 border rounded-md right-0 flex flex-col justify-center bg-white drop-shadow'
        style={{ width: '300px', zIndex: 100 }}
      >
        <div
          style={{ height: '60px' }}
          className='flex items-center font-medium border-b px-5 bg-white'
        >
          Connected Wallet:
          <img
            className='w-5 mx-1'
            src={
              connection === 'NEAR'
                ? '/images/near-logo.svg'
                : `/images/metamask_logo.png`
            }
            alt={connection === 'NEAR' ? 'near-logo' : 'metamask-logo'}
          />
          <div className='font-normal'>{connection}</div>
        </div>
        <div
          style={{ height: '60px' }}
          className='flex items-center font-medium border-b px-5 bg-white'
        >
          {connection === 'NEAR' ? 'Account ID: ' : 'Wallet address: '}
          <div className='font-normal ml-2'>
            {connection === 'NEAR' ? account : truncateEthAddress(account)}
          </div>
          <Tooltip title='Copy'>
            <CopyOutlined
              onClick={handleCopyAddress}
              style={{ fontSize: '15px', marginLeft: '0.4rem' }}
            />
          </Tooltip>
        </div>

        <div
          style={{ height: '60px' }}
          className='flex items-center font-medium px-5 bg-white hover:bg-gray-100 cursor-pointer'
          onClick={handleSignOut}
        >
          <DisconnectOutlined
            style={{ fontSize: '20px', marginRight: '1rem' }}
          />
          Disconnect Wallet
        </div>
      </div>
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account);
  };

  return (
    <div className='relative'>
      <div
        className={`bg-scorebox-blue hover:opacity-70 rounded-3xl text-white cursor-pointer flex ${
          isConnected ? 'p-3' : 'py-2 px-4'
        }`}
        onClick={() => setShowOverlay(!showOverlay)}
      >
        {isConnected ? (
          <WalletOutlined style={{ fontSize: '22px' }} />
        ) : (
          'Connect'
        )}
      </div>
      {showOverlay &&
        (isConnected ? <WalletDetailsOverlay /> : <WalletConnectOverlay />)}
    </div>
  );
}

import Link from 'next/link';
import Button from '@scorebox/src/components/Button';
import { useScoreContext } from '@scorebox/src/context';
import truncateEthAddress from 'truncate-eth-address';

export default function Header() {
  const { handleNearSignIn, handleMetaMask, isConnected, account } =
    useScoreContext();
  return (
    <div>
      <header
        className='horizontal_padding_wide flex justify-between items-center font-sans tracking-tight z-10'
        style={{ height: '80px' }}
      >
        <Link passHref={true} href='/' legacyBehavior>
          <a className='mt-1 font-bold text-2xl'>ScoreBox</a>
        </Link>
        <div className='flex items-center'>
          <Link href='/learn'>
            <div
              className='mr-5 cursor-pointer hover:text-scorebox-blue'
              style={{ fontSize: '17px' }}
            >
              Learn
            </div>
          </Link>
          {isConnected && (
            <Link href='/start'>
              <div
                className='mr-5 cursor-pointer hover:text-scorebox-blue'
                style={{ fontSize: '17px' }}
              >
                Start
              </div>
            </Link>
          )}

          <Button
            text={`${isConnected ? 'Connected' : 'Connect'}`}
            onClick={handleNearSignIn}
          />
        </div>
      </header>
    </div>
  );
}

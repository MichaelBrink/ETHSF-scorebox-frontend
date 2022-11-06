import Link from 'next/link';

import { useScoreContext } from '@scorebox/src/context';
import Connect from '@scorebox/src/components/Connect';

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
          <a className='mt-1'>
            <img
              src={'/images/score-box-logo.svg'}
              width={180}
              height={120}
              alt='scorebox-logo'
            />
          </a>
        </Link>
        <div className='flex items-center'>
          <Link href='/learn'>
            <div
              className='mr-5 text-black cursor-pointer hover:text-scorebox-blue'
              style={{ fontSize: '17px' }}
            >
              Learn
            </div>
          </Link>
          {isConnected && (
            <Link href='/start'>
              <div
                className='mr-5 text-black cursor-pointer hover:text-scorebox-blue'
                style={{ fontSize: '17px' }}
              >
                Start
              </div>
            </Link>
          )}

          <Connect />
        </div>
      </header>
    </div>
  );
}

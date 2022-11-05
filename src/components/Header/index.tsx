import Link from 'next/link';
import Button from '@scorebox/src/components/Button';

export default function Header() {
  return (
    <div>
      <header
        className='horizontal_padding_wide flex justify-between items-center font-sans tracking-tight z-10'
        style={{ height: '80px' }}
      >
        <Link passHref={true} href='/' legacyBehavior>
          <a className='mt-1 font-bold text-xl'>ScoreBox</a>
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
          <Button text='Connect' />
        </div>
      </header>
    </div>
  );
}

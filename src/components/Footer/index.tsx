import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className={`horizontal_padding_wide py-3 w-full flex flex-row justify-between font-sans`}
      style={{
        height: '5rem',
      }}
    >
      <div>
        <Link passHref={true} href='/' legacyBehavior>
          <a className='mt-1 font-bold text-xl'>ScoreBox</a>
        </Link>

        <p className='text-scorebox-lightgray mt-1'>
          &copy; {new Date().getFullYear()} ScoreBox. All Rights Reserved.
        </p>
      </div>
      <div>
        <a>
          <img
            src='/images/ethglobal.svg'
            alt='ethgloabal-logo'
            className='w-20'
          />
          <p className='text-scorebox-lightgray mt-1'>
            Hacked at ETHSanFrancisco
          </p>
        </a>
      </div>
    </footer>
  );
}

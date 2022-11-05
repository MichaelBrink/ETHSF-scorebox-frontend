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
    </footer>
  );
}

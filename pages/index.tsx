import Button, { BUTTON_STYLES } from '@scorebox/src/components/Button';

export default function Home() {
  return (
    <div className='flex flex-col '>
      <div className='text-5xl mb-10'>
        The world is built on credit.
        <br /> Start building your credit records <br /> based on your crypto
        history.
      </div>
      <div className='flex'>
        <Button text='Get Started'></Button>
        <Button text='Learn More' style={BUTTON_STYLES.OUTLINE}></Button>
      </div>
    </div>
  );
}

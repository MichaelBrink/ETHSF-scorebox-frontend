import CardSelector from '@scorebox/src/components/CardSelector';
import NavigationButtons from '@scorebox/src/components/NavigationButtons';
import { useScoreContext } from '@scorebox/src/context';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ApplicantPage() {
  const router = useRouter();
  const { connection } = useScoreContext();
  const [selection, setSelection] = useState('');
  return (
    <div className='horizontal_padding_wide flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center section_padding'>
        <h2 className='text-4xl tracking-tight font-medium m-1'>
          Select a blockchain
        </h2>
        <p className='text-gray-500 font-light text-lg'>
          Select a blockchain you want to store your credit score on.
        </p>
      </div>

      <div className='flex justify-center'>
        <>
          <div className='mr-3'>
            <CardSelector
              title='Polygon'
              logo='polygon-logo.svg'
              alt='polygon-logo'
              width='80px'
              onClick={() => setSelection('Polygon')}
              selected={selection === 'Polygon'}
            />
          </div>
          <div className='mr-3'>
            <CardSelector
              title='Ethereum'
              logo='eth-diamond-rainbow.png'
              alt='eth-logo'
              width='50px'
              onClick={() => setSelection('Ethereum')}
              selected={selection === 'Ethereum'}
              disabled
            />
          </div>
          <CardSelector
            title='Mina'
            logo='mina-transparent.png'
            alt='mina-logo'
            width='80px'
            onClick={() => setSelection('Mina')}
            selected={selection === 'Mina'}
            disabled
          />
        </>
      </div>
      <NavigationButtons
        backHandler={() => router.push(`/start`)}
        nextHandler={() => router.push('/applicant/generate')}
        nextDisabled={!selection}
      />
    </div>
  );
}

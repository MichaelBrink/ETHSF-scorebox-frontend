import CardSelector from '@scorebox/src/components/CardSelector';
import NavigationButtons from '@scorebox/src/components/NavigationButtons';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function StartPage() {
  const router = useRouter();
  const [selection, setSelection] = useState('');
  return (
    <div className='horizontal_padding_wide flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center section_padding'>
        <h2 className='text-4xl tracking-tight font-medium m-1'>
          Select user type
        </h2>
        <p className='text-gray-500 font-light text-lg'>
          Select a blockchain you want to store your credit score on.
        </p>
      </div>

      <div className='flex flex-col justify-center'>
        <div className='mb-3'>
          <CardSelector
            title='Applicant'
            description='I would like to generate a credit score and store it on the blockchain.'
            onClick={() => setSelection('Applicant')}
            selected={selection === 'Applicant'}
            horizontal
          />
        </div>
        <div className='mr-3'>
          <CardSelector
            title='Provider'
            description={`I would like to see an applicant's score already stored on the blockchain.`}
            onClick={() => setSelection('Provider')}
            selected={selection === 'Provider'}
            horizontal
          />
        </div>
      </div>
      <NavigationButtons
        backHandler={() => router.push(`/`)}
        nextHandler={() =>
          selection === 'Applicant'
            ? router.push(`/applicant`)
            : router.push(`/provider`)
        }
        nextDisabled={!selection}
      />
    </div>
  );
}

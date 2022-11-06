import NavigationButtons from '@scorebox/src/components/NavigationButtons';
import { useRouter } from 'next/router';

export default function ProviderPage() {
  const router = useRouter();
  return (
    <div className='horizontal_padding_wide flex flex-col items-center justify-center'>
      <>
        <div className='flex flex-col items-center section_padding'>
          <h2 className='text-4xl tracking-tight font-medium m-1'>
            View an applicant&#x27;s score
          </h2>
          <p className='text-gray-500 font-light text-lg'>
            Enter your applicant&#x27;s wallet address to view their score.
          </p>
        </div>
        <div className='w-3/4 flex flex-col items-center mt-10'>
          <label className='w-full text-left mb-2 font-light text-gray-500'>
            Applicant&#x27;s wallet address
          </label>
          <input
            className='rounded py-3 px-3 border w-full'
            type='text'
            id='accountId'
          ></input>
        </div>
        <NavigationButtons backHandler={() => router.push(`/start`)} />
      </>
    </div>
  );
}

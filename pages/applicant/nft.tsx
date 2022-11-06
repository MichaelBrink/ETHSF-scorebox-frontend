import NavigationButtons from '@scorebox/src/components/NavigationButtons';
import { storageHelper } from '@scorebox/src/context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function NftPage() {
  const [nftData, setNftData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setNftData(storageHelper.get('nftData'));
    console.log(nftData);
  }, []);

  return (
    <>
      <div className='flex flex-col items-center section_padding'>
        <h2 className='text-4xl tracking-tight font-medium m-1'>
          Your NFT portfolio
        </h2>
        <p className='text-gray-500 font-light text-lg flex mt-1'>
          Data retrieved from{' '}
          <img
            src='/images/opensea-logo.png'
            alt='opensea'
            className='ml-3 w-32'
          />
        </p>
        <div className='flex my-10 md:w-1/2 justify-between'>
          <div className='flex flex-col justify-center items-center border py-3 w-40 h-40 px-3'>
            <div className='text-2xl font-medium tracking-tight rounded mb-2'>
              Total
            </div>{' '}
            <div className='text-4xl font-light text-scorebox-lightgray'>
              {nftData?.total}
            </div>
          </div>
          <div className='flex flex-col justify-center items-center border py-3 w-40 h-40 px-3'>
            <div className='text-2xl font-medium tracking-tight rounded mb-2'>
              NFT Counts
            </div>{' '}
            <div className='text-4xl font-light text-scorebox-lightgray'>
              {nftData?.nft_count}
            </div>
          </div>
          <div className='flex flex-col justify-center items-center border py-3 w-40 h-40 px-3'>
            <div className='text-2xl font-medium tracking-tight rounded mb-2 text-center'>
              NFT with Value
            </div>{' '}
            <div className='text-4xl font-light text-scorebox-lightgray'>
              {nftData?.nft_with_value}
            </div>
          </div>
        </div>
        <NavigationButtons
          backHandler={() => router.push(`/applicant/generate`)}
          nextHandler={() => console.log('/applicant/generate')}
        />
      </div>
    </>
  );
}

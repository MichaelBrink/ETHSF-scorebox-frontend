import CardSelector from '@scorebox/src/components/CardSelector';
import NavigationButtons from '@scorebox/src/components/NavigationButtons';
import { useHandleSelection } from '@scorebox/src/components/generate/hooks';
import { useRouter } from 'next/router';
import AddNftModal from './AddNftModal';
import { useState } from 'react';
import { useScoreContext } from '@scorebox/src/context';

export default function MainContainer({ setStartEthereum, setStartPolygon }) {
  const router = useRouter();
  const { connection } = useScoreContext();
  const [
    { ethereumSelected, polygonSelected, noneSelected },
    { setToEthereum, setToPolygon },
  ] = useHandleSelection();
  const [addNftModal, setAddNftModal] = useState(false);
  const IS_NEAR_CONNECTED = connection === 'NEAR';

  const handleContinue = () => {
    if (IS_NEAR_CONNECTED) {
      if (ethereumSelected) setStartEthereum();
      else setStartPolygon();
    } else {
      setAddNftModal(true);
    }
  };
  return (
    <>
      {' '}
      <div className='horizontal_padding_wide flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center section_padding'>
          <h2 className='text-4xl tracking-tight font-medium m-1'>
            Select an oracle
          </h2>
          <p className='text-gray-500 font-light text-lg'>
            Select an oracle you want to get a credit score from.
          </p>
        </div>

        <div className='flex justify-center'>
          <div className='mr-3'>
            <CardSelector
              title='Ethereum'
              logo='covalent-ethereum.png'
              alt='ethereum-logo'
              width='80px'
              onClick={setToEthereum}
              selected={ethereumSelected}
            />
          </div>
          <div className='mr-3'>
            <CardSelector
              title='Polygon'
              logo='covalent-polygon.png'
              alt='polygon-logo'
              width='80px'
              onClick={setToPolygon}
              selected={polygonSelected}
            />
          </div>
        </div>
        <NavigationButtons
          backHandler={() => router.push(`/applicant`)}
          nextHandler={() => {
            handleContinue();
          }}
          nextDisabled={noneSelected}
        />
        {addNftModal && (
          <AddNftModal
            router={router}
            addNftModal={addNftModal}
            setAddNftModal={setAddNftModal}
            setStartCovalent={setStartEthereum}
            setStartPolygon={setStartPolygon}
            polygonSelected={polygonSelected}
          />
        )}
      </div>
    </>
  );
}

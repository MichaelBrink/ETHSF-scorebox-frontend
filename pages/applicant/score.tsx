import ScoreGauge from '@scorebox/src/components/ScoreGauge';
import { useScoreContext } from '@scorebox/src/context';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button, { BUTTON_STYLES } from '@scorebox/src/components/Button';
import Modal from 'antd/lib/modal/Modal';

export default function ScorePage() {
  const { scoreResponse, account } = useScoreContext();

  const [checkoutModal, setCheckoutModal] = useState(false);
  const [showScoreDescription, setShowScoreDescription] = useState(false);
  const router = useRouter();

  const renderQuality = (score: number) => {
    const qualityBin = [
      'very poor',
      'poor',
      'fair',
      'good',
      'very good',
      'excellent',
      'exceptional',
    ];
    const scoreBin = [300, 500, 560, 650, 740, 800, 870, 900];
    let quality;
    for (let i = 0; i < scoreBin.length; i++) {
      if (score > scoreBin[i] && score < scoreBin[i + 1]) {
        quality = qualityBin[i];
      } else if (score === scoreBin[i] && score === 900) {
        quality = qualityBin[i - 1];
      }
    }
    return quality;
  };

  return (
    <>
      <div className='w-full flex flex-col justify-center text-center items-center'>
        <h2 className='text-4xl tracking-tight font-medium m-1'>
          Your Credit Score
        </h2>
        <p className='text-gray-500 font-light text-lg'>
          Calculated with provider name
        </p>
        {scoreResponse?.score && (
          <div className='flex w-full justify-center z-0'>
            <ScoreGauge
              score={scoreResponse?.score}
              quality={renderQuality(scoreResponse?.score)}
            />
          </div>
        )}
        <div>
          <Button
            onClick={() => setShowScoreDescription(true)}
            style={BUTTON_STYLES.LINK}
            text='💡 Learn more about my score >'
            classes={{
              button: 'text-sm mt-3 hover:text-blue font-medium',
            }}
          />
          <div className='mt-3'>
            <Button
              text='Save it to blockchain'
              onClick={() => setCheckoutModal(true)}
            />
          </div>
        </div>
      </div>
      <Modal
        open={showScoreDescription}
        footer={null}
        onCancel={() => setShowScoreDescription(false)}
        style={{ top: '20%' }}
      >
        <div
          className={`sm:px-8 flex py-5 justify-center rounded-md z-50 duration-500 font-sans `}
        >
          <div className='p-8 rounded-lg z-50 max-w-xl w-full'>
            <h3 className='text-scorebox-blue text-lg uppercase font-semibold mb-4'>
              Summary 🔍
            </h3>
            <p className='sm:text-base leading-7 mb-3 text-xs tracking-tighter'>
              {scoreResponse?.message}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

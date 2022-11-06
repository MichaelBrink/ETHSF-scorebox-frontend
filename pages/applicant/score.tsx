import ScoreGauge from '@scorebox/src/components/ScoreGauge';
import { useScoreContext } from '@scorebox/src/context';
export default function ScorePage() {
  const { scoreResponse } = useScoreContext();
  console.log(scoreResponse);
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
    </div>
  );
}

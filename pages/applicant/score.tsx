import ScoreGauge from '@scorebox/src/components/ScoreGauge';

export default function ScorePage() {
  return (
    <div className='w-full flex flex-col justify-center text-center items-center'>
      <h2 className='text-4xl tracking-tight font-medium m-1'>
        Your Credit Score
      </h2>
      <p className='text-gray-500 font-light text-lg'>
        Calculated with provider name
      </p>
      <div className='flex w-full justify-center z-0'>
        <ScoreGauge quality={'poor'} score={450} />
      </div>
    </div>
  );
}

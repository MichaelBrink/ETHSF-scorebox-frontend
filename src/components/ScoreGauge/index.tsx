import GaugeChart from 'react-gauge-chart';
import React from 'react';

const ScoreGauge = ({ score, quality }: { score: number; quality: string }) => {
  const renderTagBgColor = (quality: string) => {
    let bgColor;

    switch (quality) {
      case 'very poor':
        bgColor = '#FF5757';
        break;

      case 'poor':
        bgColor = '#EE8EB0';
        break;

      case 'fair':
        bgColor = '#99428E';
        break;

      case 'good':
        bgColor = '#8F00FF';
        break;

      case 'very good':
        bgColor = '#554BF9';
        break;

      case 'excellent':
        bgColor = '#3AA7A3';
        break;

      case 'exceptional':
        bgColor = '#4DD09A';
        break;

      default:
        bgColor = '#E03C37';
    }

    return bgColor;
  };

  return (
    <div className='w-full lg:w-1/2'>
      <GaugeChart
        arcsLength={[0.33, 0.1, 0.15, 0.15, 0.1, 0.116, 0.05]}
        arcPadding={0.02}
        arcWidth={0.08}
        cornerRadius={30}
        percent={(score - 300) / 601}
        colors={[
          '#FF5757',
          '#EE8EB0',
          '#D3AAFF',
          '#7268FF',
          '#3972DB',
          '#3AA7A3',
          '#4DD09A',
        ]}
        textColor='#000000'
        hideText={true}
        style={{ position: 'relative' }}
      />
      <div className='text-7xl font-semibold tracking-tight'>{score}</div>

      <div className='justify-center items-center w-full z-50 flex flex-col'>
        <div
          className='px-4 py-1 text-xs sm:text-xs rounded-2xl mt-4 uppercase text-white'
          style={{ backgroundColor: renderTagBgColor(quality) }}
        >
          {quality}
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;

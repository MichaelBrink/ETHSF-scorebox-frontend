import PropagateLoader from 'react-spinners/PropagateLoader';
import BounceLoader from 'react-spinners/BounceLoader';
import RingLoader from 'react-spinners/RingLoader';

export const LoadingContainer = ({
  text = 'Requesting score, this may take a minute.',
}: {
  text: String;
}) => (
  <div className='w-full h-full flex flex-col justify-center items-center z-50'>
    <BounceLoader color={'#364EFF'} size={100} />
    <p
      data-testid='loading-text'
      className='mt-10 text-base trakcing-tight text-gray-600'
    >
      {text}
    </p>
  </div>
);

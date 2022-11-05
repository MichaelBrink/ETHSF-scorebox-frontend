import { useRouter } from 'next/router';
import MainContainer from '@scorebox/src/components/generate/MainContainer';
import {
  useHandleSdk,
  useHandleAwaitingScoreResponse,
} from '@scorebox/src/components/generate/hooks';
import Covalent from '@scorebox/src/components/Covalent';
import { LoadingContainer } from '@scorebox/src/components/LoadingContainer';

export default function GeneratePage() {
  const [startEthereum, startPolygon, { setStartEthereum, setStartPolygon }] =
    useHandleSdk();

  const [awaitingScoreResponse, { setToWaiting, setNotWaiting }] =
    useHandleAwaitingScoreResponse();

  const router = useRouter();
  const queryStatus = router.query.status;
  return (
    <>
      {awaitingScoreResponse && (
        <LoadingContainer text='Calcultaing your score..This may take a minute' />
      )}
      {!awaitingScoreResponse && (
        <MainContainer
          setStartEthereum={setStartEthereum}
          setStartPolygon={setStartPolygon}
        />
      )}
      {startEthereum && (
        <Covalent
          setToWaiting={setToWaiting}
          setNotWaiting={setNotWaiting}
          router={router}
          chainId={1}
        />
      )}
      {startPolygon && (
        <Covalent
          setToWaiting={setToWaiting}
          setNotWaiting={setNotWaiting}
          router={router}
          chainId={137}
        />
      )}
      {queryStatus && <div>Success!</div>}
    </>
  );
}

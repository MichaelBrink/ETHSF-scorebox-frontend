// @ts-nocheck
import { useRouter } from 'next/router';
import MainContainer from '@scorebox/src/components/generate/MainContainer';
import {
  useHandleSdk,
  useHandleAwaitingScoreResponse,
  useManageExistingScore,
  useHandleExistingScore,
} from '@scorebox/src/components/generate/hooks';
import Covalent from '@scorebox/src/components/Covalent';
import { LoadingContainer } from '@scorebox/src/components/LoadingContainer';
import ScoreResponseModal from '@scorebox/src/components/ScoreResponseModal';
import { useScoreContext } from '@scorebox/src/context';
import ExistingScoreModal from '@scorebox/src/components/generate/ExistingScoreModal';

export default function GeneratePage() {
  const { setScoreResponse, chainActivity, handleSetChainActivity } =
    useScoreContext();
  const router = useRouter();
  const queryStatus = router.query.status;
  const queryType = router.query.type;
  const [
    startEthereum,
    startPolygon,
    { setStartEthereum, setStartPolygon, setSdkUndefined },
  ] = useHandleSdk();

  const [awaitingScoreResponse, { setToWaiting, setNotWaiting }] =
    useHandleAwaitingScoreResponse();

  const [
    existingScoreIsLoading,
    scoreExists,
    { setExistingScoreToTrue, setExistingScoreToFalse },
  ] = useHandleExistingScore();

  useManageExistingScore({
    chainActivity,
    setExistingScoreToTrue,
    setExistingScoreToFalse,
    queryType,
    router,
  });

  const startOver = () => {
    setSdkUndefined();
    setNotWaiting();
    setScoreResponse(null);
    router.replace('/applicant/generate');
  };

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
      {queryStatus && (
        <ScoreResponseModal
          queryStatus={queryStatus}
          queryType={queryType}
          pushToScore={() => router.push('/applicant/score')}
          startOver={startOver}
        />
      )}
      {scoreExists && (
        <ExistingScoreModal
          scoreExists={scoreExists}
          startOver={startOver}
          handleSetChainActivity={handleSetChainActivity}
          chainActivity={chainActivity}
        />
      )}
    </>
  );
}

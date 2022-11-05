import MainContainer from '@scorebox/src/components/generate/MainContainer';
import { useHandleSdk } from '@scorebox/src/components/generate/hooks';

export default function GeneratePage() {
  const [startEthereum, startPolygon, { setStartEthereum, setStartPolygon }] =
    useHandleSdk();

  return (
    <MainContainer
      setStartEthereum={setStartEthereum}
      setStartPolygon={setStartPolygon}
    />
  );
}

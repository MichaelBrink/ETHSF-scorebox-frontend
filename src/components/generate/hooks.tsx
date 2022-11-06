import { useState, useMemo, useEffect } from 'react';

export function useHandleSelection() {
  const [selection, setSelection] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setToEthereum: () => setSelection('ethereum'),
      setToPolygon: () => setSelection('polygon'),
    };
  }, []);

  const selections = useMemo(() => {
    return {
      ethereumSelected: selection === 'ethereum',
      polygonSelected: selection === 'polygon',
      noneSelected: selection === undefined,
    };
  }, [selection]);

  return [selections, handlers] as const;
}

export function useHandleSdk() {
  const [sdk, setSdk] = useState<string | undefined>(undefined);

  const handlers = useMemo(() => {
    return {
      setStartEthereum: () => setSdk('ethereum'),
      setStartPolygon: () => setSdk('polygon'),
      setSdkUndefined: () => setSdk(undefined),
    };
  }, []);

  const startEthereum = sdk === 'ethereum';
  const startPolygon = sdk === 'polygon';

  return [startEthereum, startPolygon, handlers] as const;
}

export function useHandleAwaitingScoreResponse() {
  const [awaitingScoreResponse, setAwaitingScoreResponse] =
    useState<boolean>(false);

  const handlers = useMemo(() => {
    return {
      setToWaiting: () => setAwaitingScoreResponse(true),
      setNotWaiting: () => setAwaitingScoreResponse(false),
    };
  }, []);

  return [awaitingScoreResponse, handlers] as const;
}

export function useHandleExistingScore() {
  const [isExistingScore, setIsExistingScore] = useState<
    'loading' | true | false
  >('loading');

  const handlers = useMemo(() => {
    return {
      setExistingScoreToTrue: () => setIsExistingScore(true),
      setExistingScoreToFalse: () => setIsExistingScore(false),
    };
  }, []);

  const existingScoreIsLoading = isExistingScore === 'loading';
  const scoreExists = !!isExistingScore;

  return [existingScoreIsLoading, scoreExists, handlers] as const;
}

export function useManageExistingScore({
  chainActivity,
  setExistingScoreToTrue,
  setExistingScoreToFalse,
  queryType,
  router,
}: any) {
  useEffect(() => {
    if (chainActivity?.scoreSubmitted) {
      setExistingScoreToTrue();
      !!queryType && router.replace('/applicant/generate');
    } else setExistingScoreToFalse();
  }, [
    chainActivity,
    queryType,
    router,
    setExistingScoreToFalse,
    setExistingScoreToTrue,
  ]);
}

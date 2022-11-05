import { useState, useMemo } from 'react';

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
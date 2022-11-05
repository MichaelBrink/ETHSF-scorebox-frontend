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

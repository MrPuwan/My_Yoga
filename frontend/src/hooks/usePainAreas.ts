import { useCallback, useEffect, useState } from 'react';
import { getPainAreas } from '../services/pain-areas.service';
import type { PainAreaOption } from '../types/pain-area';
import { getApiErrorMessage } from '../utils/api-error';

export function usePainAreas() {
  const [painAreas, setPainAreas] = useState<PainAreaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPainAreas(await getPainAreas());
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, 'Unable to load pain areas.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    painAreas,
    names: painAreas.map((painArea) => painArea.name),
    loading,
    error,
    reload,
  };
}

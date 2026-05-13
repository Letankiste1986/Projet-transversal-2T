import { useEffect, useMemo, useState } from 'react';
import {
  addOrReplaceMesure,
  createMesuresSocket,
  fetchMesures,
  getLastMesure,
  type Mesure,
} from '../services/mesures';

export function useMesures() {
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchMesures()
      .then((data) => {
        if (!isMounted) return;
        setMesures(data);
        setError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Donnees indisponibles');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    const socket = createMesuresSocket();

    socket.on('connect', () => {
      if (isMounted) setIsLive(true);
    });

    socket.on('disconnect', () => {
      if (isMounted) setIsLive(false);
    });

    socket.on('connect_error', () => {
      if (isMounted) setIsLive(false);
    });

    socket.on('new-mesure', (mesure: Mesure) => {
      if (!isMounted) return;
      setMesures((current) => addOrReplaceMesure(current, mesure));
      setError(null);
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, []);

  const lastMesure = useMemo(() => getLastMesure(mesures), [mesures]);

  return {
    mesures,
    lastMesure,
    isLoading,
    error,
    isLive,
  };
}

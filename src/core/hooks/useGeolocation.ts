import { useState, useCallback } from 'react';

interface GeolocationResult {
  city: string;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [result, setResult] = useState<GeolocationResult>({
    city: '',
    loading: false,
    error: null,
  });

  const detectCity = useCallback(async (): Promise<string | null> => {
    if (!navigator.geolocation) {
      setResult(r => ({ ...r, error: 'Geolocation not supported' }));
      return null;
    }

    setResult({ city: '', loading: true, error: null });

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use reverse geocoding via BigDataCloud (free, no key needed)
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || '';
            setResult({ city, loading: false, error: null });
            resolve(city);
          } catch {
            setResult({ city: '', loading: false, error: 'Failed to detect city' });
            resolve(null);
          }
        },
        (err) => {
          setResult({ city: '', loading: false, error: err.message });
          resolve(null);
        },
        { timeout: 10000 }
      );
    });
  }, []);

  return { ...result, detectCity };
};

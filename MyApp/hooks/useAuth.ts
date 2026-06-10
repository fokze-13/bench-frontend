import { useState, useEffect } from 'react';
import { fetchToken, getToken } from '@/utils/auth';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getToken()
      .then(saved => saved ? setToken(saved) : fetchToken().then(setToken))
      .catch(() => setError('Не удалось подключиться к серверу'));
  }, []);

  return { token, error };
}
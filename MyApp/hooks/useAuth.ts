import { useState, useEffect } from "react";
import { fetchToken, getToken } from "@/utils/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const saved = await getToken();

        if (saved) {
          setToken(saved);
          return;
        }

        const newToken = await fetchToken();
        setToken(newToken);
      } catch (e) {
        setError(String(e));
      }
    };

    init();
  }, []);

  return { token, error };
}

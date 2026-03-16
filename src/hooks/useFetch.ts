import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!url) return; // url null = não busca nada

    const controller = new AbortController(); // Cancela o request de verdade

    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        return res.json() as Promise<T>;
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name === 'AbortError') return; // Ignorar cancelamento — não é erro
        setState({ data: null, loading: false, error: err.message });
      });

    return () => controller.abort(); // Cancela o request se o componente desmontar
  }, [url]);

  return state;
}

export { useFetch }
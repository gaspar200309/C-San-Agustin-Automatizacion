import { useState, useEffect, useCallback } from "react";

const useFetchData = (fetchFunction, shouldFetch = true, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(shouldFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return; 
    try {
      setLoading(true);
      const response = await fetchFunction();
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;

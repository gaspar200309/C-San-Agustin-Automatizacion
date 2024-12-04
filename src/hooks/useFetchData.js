import { useState, useEffect, useRef } from "react";

const useFetchData = (fetchFunction, options = {}) => {
  const { shouldFetch = true, dependencies = [], initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(shouldFetch);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchData = async (...args) => {
    if (!shouldFetch) return;

    setLoading(true);
    try {
      const response = await fetchFunction(...args);
      if (isMounted.current) {
        setData(response.data || null);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;

    if (shouldFetch) {
      fetchData();
    }

    return () => {
      isMounted.current = false; // Cancel any state updates on unmount
    };
  }, dependencies); // dependencies provided via options

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;

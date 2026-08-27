import {
  useCallback,
  useEffect,
  useState
} from "react";

export default function useFetch(
  fetchFunction,
  options = {}
) {
  const {
    immediate = true,
    dependencies = []
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await fetchFunction(...args);

        const result =
          response?.data !== undefined
            ? response.data
            : response;

        setData(result);

        return result;
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Request failed"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  };
}
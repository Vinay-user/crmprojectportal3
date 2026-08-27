import { useMemo, useState } from "react";

export default function usePagination(
  initialPage = 0,
  initialSize = 10
) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] =
    useState(initialSize);

  const offset = useMemo(
    () => page * pageSize,
    [page, pageSize]
  );

  const nextPage = (totalPages) => {
    setPage((current) =>
      current + 1 < totalPages
        ? current + 1
        : current
    );
  };

  const previousPage = () => {
    setPage((current) =>
      current > 0 ? current - 1 : 0
    );
  };

  const reset = () => {
    setPage(0);
  };

  return {
    page,
    pageSize,
    offset,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    reset
  };
}
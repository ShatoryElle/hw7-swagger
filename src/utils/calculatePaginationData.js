const calculatePaginationData = ({ page, perPage, totalItems, data = [] }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: Array.isArray(data) ? data : [],
    page: Math.min(page, totalPages),
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export default calculatePaginationData;
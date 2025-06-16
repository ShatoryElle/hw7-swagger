const parseSortParams = (query) => {
    const allowedSortBy = ['name'];
    const allowedSortOrder = ['asc', 'desc'];
  
    const sortBy = allowedSortBy.includes(query.sortBy) ? query.sortBy : 'name';
    const sortOrder = allowedSortOrder.includes(query.sortOrder)
      ? query.sortOrder
      : 'asc';
  
    return { sortBy, sortOrder };
  };
  
  export default parseSortParams;
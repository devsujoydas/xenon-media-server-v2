/**
 * parsePagination
 * Normalizes page/limit query params into safe { page, limit, skip } values.
 */
const parsePagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100); // hard cap at 100
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * buildPaginationMeta
 * Builds the standard pagination metadata block returned by list endpoints.
 */
const buildPaginationMeta = ({ totalItems, page, limit }) => {
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0;

  return {
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1 && page <= totalPages,
  };
};

module.exports = { parsePagination, buildPaginationMeta };
export const normalizePagination = (pagination = {}) => {
  const page = Math.max(parseInt(pagination.page) || 1, 1);
  const limit = Math.min(parseInt(pagination.limit) || 10, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

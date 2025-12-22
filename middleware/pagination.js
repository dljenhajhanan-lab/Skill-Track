export const pagination = (req, _res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};

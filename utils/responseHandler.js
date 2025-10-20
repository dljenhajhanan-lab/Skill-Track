export const successResponse = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, error, statusCode = 400) => {
  const message = typeof error === "string" ? error : error.message || "Something went wrong";
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

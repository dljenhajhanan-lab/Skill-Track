import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { verifyCourseraCertificate, listMyCertificates } from "../../services/courseraService.js";

export const verifyCoursera = catchAsync(async (req, res) => {
  const { shareUrl } = req.body;
  const result = await verifyCourseraCertificate(req.user._id, shareUrl);
  successResponse(res, result.data, result.message, 200);
});

export const getMyCourseraCertificates = catchAsync(async (req, res) => {
  const result = await listMyCertificates(req.user._id);
  successResponse(res, result.data, result.message, 200);
});

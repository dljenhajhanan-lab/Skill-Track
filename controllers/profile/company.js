import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { getCompanyProfile, updateCompanyProfile } from "../../services/companyService.js";

export const getCompany = catchAsync(async (req, res) => {
  const result = await getCompanyProfile(req.user._id);
  successResponse(res, result.data, result.message, 200);
});

export const updateCompany = catchAsync(async (req, res) => {
  const result = await updateCompanyProfile(req.user._id, req.body);
  successResponse(res, result.data, result.message, 200);
});

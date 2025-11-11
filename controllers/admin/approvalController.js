import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { updateStatus, listAllPending} from "../../services/approvalService.js";

export const approveRequest = catchAsync(async (req, res) => {
  const { role, id } = req.params;
  const result = await updateStatus(role, id, "approved");
  successResponse(res, result.data, result.message);
});

export const rejectRequest = catchAsync(async (req, res) => {
  const { role, id } = req.params;
  const result = await updateStatus(role, id, "rejected");
  successResponse(res, result.data, result.message);
});

export const getAllPending = catchAsync(async (req, res) => {
  const result = await listAllPending();
  successResponse(res, result.data, result.message);
});

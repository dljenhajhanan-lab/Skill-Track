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
  const { type, page = 1, limit = 10 } = req.query;

  const data = await listAllPending(type, Number(page), Number(limit));

  successResponse(res, data, "Approvals");
});


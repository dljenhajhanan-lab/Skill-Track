import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { requestCreation, updateStatus, listAllPending} from "../../services/approvalService.js";

export const createRequest = catchAsync(async (req, res) => {
  const { role } = req.params;
  const result = await requestCreation(role, req.body);
  successResponse(res, result.data, result.message, 201);
});

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

import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createTask,submitTaskSolution,getAllTasks,getTaskById,getTaskSubmissionsCompany,getStudentTraiesTaskSubmissions,deleteTask,getTasks } from "../../services/companyTask.js";

export const createCompanyTask = catchAsync(async (req, res) => {
  const result = await createTask(req.user._id, req.body);
  successResponse(res, result.data, result.message, 201);
});

export const submitCompanyTaskSolution = catchAsync(async (req, res) => {
  const result = await submitTaskSolution(req.user._id,req.params.taskId,req.body);
  successResponse(res, result.data, result.message, 201);
});

export const getAllCompanyTasks = catchAsync(async (req, res) => {
  const pagination = {page: req.query.page,limit: req.query.limit,};
  const result = await getAllTasks(pagination);
  successResponse(res, result.data, result.message, 200);
});

export const getCompanyTaskById = catchAsync(async (req, res) => {
  const result = await getTaskById(req.params.taskId);
  successResponse(res, result.data, result.message, 200);
});

export const getCompanyTaskSubmissions = catchAsync(async (req, res) => {
  const pagination = { page: req.query.page,limit: req.query.limit };
  const result = await getTaskSubmissionsCompany(
    req.params.taskId,
    pagination
  );
  successResponse(res, result.data, result.message, 200);
});

export const getTaskSubmissions = catchAsync(async (req, res) => {
  const pagination = { page: req.query.page,limit: req.query.limit };
  const result = await getStudentTraiesTaskSubmissions( req.params.studentId,pagination );
  successResponse(res, result.data, result.message, 200);
});

export const deleteCompanyTask = catchAsync(async (req, res) => {
  const result = await deleteTask(req.params.taskId, req.user._id);
  successResponse(res, null, result.message, 200);
});

export const getCompanyTasks = catchAsync(async (req, res) => {
  const pagination = { page: req.query.page,limit: req.query.limit };
  const result = await getTasks(req.user._id, pagination);
  successResponse(res, result.data, result.message, 200);
});
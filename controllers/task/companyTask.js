import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { companyTaskService } from "./companyTask.service.js";

export const createCompanyTask = catchAsync(async (req, res) => {
  const task = await companyTaskService.createTask(req.user._id, req.body);
  successResponse(res, task, "The Task Was Created Successfully.", 201);
});

export const submitCompanyTaskSolution = catchAsync(async (req, res) => {
  const submission = await companyTaskService.submitSolution(req.user._id,req.params.taskId,req.body);
  successResponse(res, submission, "The Solution Was Submitted and Evaluated Successfully.", 201);
});

export const getAllCompanyTasks = catchAsync(async (req, res) => {
  const tasks = await companyTaskService.getTasks();
  successResponse(res, tasks, "All Tasks Were Retrieved Successfully.", 200);
});

export const getCompanyTaskById = catchAsync(async (req, res) => {
  const task = await companyTaskService.getTaskById(req.params.taskId);
  successResponse(res, task, "The Task Details Were Retrieved Successfully.", 200);
});

export const getCompanyTaskSubmissions = catchAsync(async (req, res) => {
  const submissions = await companyTaskService.getTaskSubmissions(req.params.taskId);
  successResponse(res, submissions, "All Solutions Were Successfully Retrieved.", 200);
});

export const getStudentTaskSubmissions = catchAsync(async (req, res) => {
  const submissions = await companyTaskService.getStudentSubmissions(req.params.studentId);
  successResponse(res, submissions, "All Student Solutions Were Successfully Retrieved.", 200);
});

export const deleteCompanyTask = catchAsync(async (req, res) => {
  const result = await companyTaskService.deleteTask(req.params.taskId, req.user._id);
  successResponse(res, null, result.message, 200);
});

export const getCompanyTasks = catchAsync(async (req, res) => {
  const result = await companyTaskService.getCompanyTasks(req.user._id);
  successResponse(res, result.data, result.message, 200);
});
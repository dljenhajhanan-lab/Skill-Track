import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import {
  verifyOneCertificateService,
  importCertificatesByUrlsService,
  listMyCourseraCertificatesService,
} from "../../services/courseraService.js";

export const verifyCertificate = catchAsync(async (req, res) => {
  const { shareUrl } = req.body || {};
  const studentName = req.user.name;
  const result = await verifyOneCertificateService(req.user._id, shareUrl, studentName);
  successResponse(res, result.data, result.message, 201);
});

export const importByUrls = catchAsync(async (req, res) => {
  const { certificates } = req.body || {};
  const studentName = req.user.name;
  const result = await importCertificatesByUrlsService(req.user._id, studentName, certificates);
  successResponse(res, result.data, result.message, 201);
});

export const myCertificates = catchAsync(async (req, res) => {
  const result = await listMyCourseraCertificatesService(req.user._id);
  successResponse(res, result.data, result.message, 200);
});

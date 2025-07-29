const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/error.response');

const createReport = catchAsync(async (req, res) => {
  const report = await reportService.createReport({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(report);
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'reportableModel', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.queryReports(filter, options);
  res.send(result);
});

const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  res.send(report);
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReportById(req.params.reportId, req.body);
  res.send(report);
});

const deleteReport = catchAsync(async (req, res) => {
  await reportService.deleteReportById(req.params.reportId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getReportsByStatus = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getReportsByStatus(req.params.status, options);
  res.send(result);
});

const getReportsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getReportsByUser(req.params.userId, options);
  res.send(result);
});

const getReportsByReportable = catchAsync(async (req, res) => {
  const { reportableModel, reportableId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getReportsByReportable(reportableModel, reportableId, options);
  res.send(result);
});

const updateReportStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const report = await reportService.updateReportStatus(req.params.reportId, status);
  res.send(report);
});

const getPendingReports = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getPendingReports(options);
  res.send(result);
});

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  getReportsByStatus,
  getReportsByUser,
  getReportsByReportable,
  updateReportStatus,
  getPendingReports,
}; 
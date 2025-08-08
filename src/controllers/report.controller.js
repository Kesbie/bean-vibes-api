
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');
const pick = require('../utils/pick');
const { NOT_FOUND } = require('../utils/error.response');
const { CREATED, OK, NO_CONTENT } = require('../utils/success.response');

const createReport = catchAsync(async (req, res) => {
  const report = await reportService.createReport({
    ...req.body,
    user: req.user.id,
  });
  new CREATED(report).send(res);
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'reportableModel', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  options.customSort = 'status';
  

  const result = await reportService.queryReports(filter, options);
  new OK(result).send(res);
});

const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportById(req.params.reportId);
  if (!report) {
    throw new NOT_FOUND('Report not found');
  }
  new OK(report).send(res);
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReportById(req.params.reportId, req.body);
  new OK(report).send(res);
});

const deleteReport = catchAsync(async (req, res) => {
  await reportService.deleteReportById(req.params.reportId);
  new NO_CONTENT().send(res);
});

const getReportsByStatus = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getReportsByStatus(req.params.status, options);
  new OK(result).send(res);
});

const getReportsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getReportsByUser(req.params.userId, options);
  new OK(result).send(res);
});

const getReportsByReportable = catchAsync(async (req, res) => {
  const { reportableModel, reportableId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getReportsByReportable(reportableModel, reportableId, options);
  new OK(result).send(res);
});

const updateReportStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const report = await reportService.updateReportStatus(req.params.reportId, status);
  new OK(report).send(res);
});

const resolveReport = catchAsync(async (req, res) => {
  const { resolvedActions } = req.body;
  const report = await reportService.resolveReport(req.params.reportId, resolvedActions);
  new OK(report).send(res);
});

const getPendingReports = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.getPendingReports(options);
  new OK(result).send(res);
});

const getReportedUsersStats = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy']);
  const result = await reportService.getReportedUsersStats(options);
  new OK(result).send(res);
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
  resolveReport,
  getPendingReports,
  getReportedUsersStats,
}; 
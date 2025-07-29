const httpStatus = require('http-status');
const { Report } = require('../models');
const ApiError = require('../utils/error.response');
const pick = require('../utils/pick');

/**
 * Create a report
 * @param {Object} reportBody
 * @returns {Promise<Report>}
 */
const createReport = async (reportBody) => {
  return Report.create(reportBody);
};

/**
 * Query for reports
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReports = async (filter, options) => {
  const reports = await Report.paginate(filter, options);
  return reports;
};

/**
 * Get report by id
 * @param {ObjectId} id
 * @returns {Promise<Report>}
 */
const getReportById = async (id) => {
  return Report.findById(id)
    .populate('user', 'name email')
    .populate('review', 'title content')
    .populate('comment', 'content');
};

/**
 * Update report by id
 * @param {ObjectId} reportId
 * @param {Object} updateBody
 * @returns {Promise<Report>}
 */
const updateReportById = async (reportId, updateBody) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  Object.assign(report, updateBody);
  await report.save();
  return report;
};

/**
 * Delete report by id
 * @param {ObjectId} reportId
 * @returns {Promise<Report>}
 */
const deleteReportById = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  await report.remove();
  return report;
};

/**
 * Get reports by status
 * @param {string} status
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReportsByStatus = async (status, options) => {
  const filter = { status };
  return queryReports(filter, options);
};

/**
 * Get reports by user
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReportsByUser = async (userId, options) => {
  const filter = { user: userId };
  return queryReports(filter, options);
};

/**
 * Get reports by reportable type
 * @param {string} reportableModel
 * @param {ObjectId} reportableId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getReportsByReportable = async (reportableModel, reportableId, options) => {
  const filter = { reportableModel, reportable: reportableId };
  return queryReports(filter, options);
};

/**
 * Update report status
 * @param {ObjectId} reportId
 * @param {string} status
 * @returns {Promise<Report>}
 */
const updateReportStatus = async (reportId, status) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  report.status = status;
  await report.save();
  return report;
};

/**
 * Get pending reports
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getPendingReports = async (options) => {
  return getReportsByStatus('pending', options);
};

module.exports = {
  createReport,
  queryReports,
  getReportById,
  updateReportById,
  deleteReportById,
  getReportsByStatus,
  getReportsByUser,
  getReportsByReportable,
  updateReportStatus,
  getPendingReports,
}; 
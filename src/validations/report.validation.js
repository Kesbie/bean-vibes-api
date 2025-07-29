const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReport = {
  body: Joi.object().keys({
    reportable: Joi.string().custom(objectId).required(),
    reportableModel: Joi.string().valid('Review', 'Comment').required(),
    review: Joi.string().custom(objectId),
    comment: Joi.string().custom(objectId),
    title: Joi.string().required().min(1).max(200),
    reason: Joi.string().required().min(1).max(1000),
  }),
};

const getReports = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    reportableModel: Joi.string().valid('Review', 'Comment'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId).required(),
  }),
};

const updateReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().min(1).max(200),
      reason: Joi.string().min(1).max(1000),
      status: Joi.string().valid('pending', 'approved', 'rejected'),
    })
    .min(1),
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId).required(),
  }),
};

const getReportsByStatus = {
  params: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReportsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReportsByReportable = {
  params: Joi.object().keys({
    reportableModel: Joi.string().valid('Review', 'Comment').required(),
    reportableId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateReportStatus = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected').required(),
  }),
};

const getPendingReports = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

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
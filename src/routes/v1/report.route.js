const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reportValidation } = require('../../validations');
const { reportController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reportValidation.createReport), reportController.createReport)
  .get(auth('getReports'), validate(reportValidation.getReports), reportController.getReports);

router
  .route('/pending')
  .get(auth('getReports'), validate(reportValidation.getPendingReports), reportController.getPendingReports);

router
  .route('/stats/users')
  .get(auth('getReports'), validate(reportValidation.getReportedUsersStats), reportController.getReportedUsersStats);

router
  .route('/status/:status')
  .get(auth('getReports'), validate(reportValidation.getReportsByStatus), reportController.getReportsByStatus);

router
  .route('/user/:userId')
  .get(auth('getReports'), validate(reportValidation.getReportsByUser), reportController.getReportsByUser);

router
  .route('/reportable/:reportableModel/:reportableId')
  .get(auth('getReports'), validate(reportValidation.getReportsByReportable), reportController.getReportsByReportable);

router
  .route('/:reportId')
  .get(auth('getReports'), validate(reportValidation.getReport), reportController.getReport)
  .patch(auth('manageReports'), validate(reportValidation.updateReport), reportController.updateReport)
  .delete(auth('manageReports'), validate(reportValidation.deleteReport), reportController.deleteReport);

router
  .route('/:reportId/status')
  .patch(auth('manageReports'), validate(reportValidation.updateReportStatus), reportController.updateReportStatus);

router
  .route('/:reportId/resolve')
  .post(auth('manageReports'), validate(reportValidation.resolveReport), reportController.resolveReport);

module.exports = router; 
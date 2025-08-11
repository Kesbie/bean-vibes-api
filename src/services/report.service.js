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
 * @param {string} [options.customSort] - Custom sorting field
 * @returns {Promise<QueryResult>}
 */
const queryReports = async (filter, options) => {
  // Check if custom sorting is requested
  if (options.customSort === 'status') {
    const { limit = 10, page = 1 } = options;
    
    // Use aggregation pipeline for custom sorting
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'pending'] }, then: 1 },
                { case: { $eq: ['$status', 'resolved'] }, then: 2 }
              ],
              default: 3
            }
          }
        }
      },
      { $sort: { statusOrder: 1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reportable',
          foreignField: '_id',
          as: 'reportableInfo'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'reportable',
          foreignField: '_id',
          as: 'commentInfo'
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$userInfo', 0] },
          reportable: {
            $cond: {
              if: { $eq: ['$reportableModel', 'Review'] },
              then: { $arrayElemAt: ['$reportableInfo', 0] },
              else: { $arrayElemAt: ['$commentInfo', 0] }
            }
          }
        }
      },
      {
        $project: {
          userInfo: 0,
          reportableInfo: 0,
          commentInfo: 0,
          statusOrder: 0
        }
      }
    ];

    // Get total count for pagination
    const totalResults = await Report.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const reports = await Report.aggregate(pipeline);

    // Add reportableType to each report for easier identification
    if (reports && reports.length > 0) {
      reports.forEach(report => {
        if (report.reportable) {
          report.reportable.reportableType = report.reportableModel;
        }
      });
    }

    return {
      results: reports,
      page,
      limit,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  // Use regular pagination if no custom sorting
  const populateOptions = [
    {
      path: 'user',
      select: 'name email'
    },
    {
      path: 'reportable',
      select: 'title content user' // For Review: title, content, user; For Comment: content, user
    }
  ];
  
  const reports = await Report.paginate(filter, {
    ...options,
    populate: populateOptions
  });
  
  // Add reportableType to each report for easier identification
  if (reports.results) {
    reports.results = reports.results.map(report => {
      if (report.reportable) {
        report.reportable.reportableType = report.reportableModel;
      }
      return report;
    });
  }
  
  return reports;
};

/**
 * Get report by id
 * @param {ObjectId} id
 * @returns {Promise<Report>}
 */
const getReportById = async (id) => {
  const report = await Report.findById(id)
    .populate('user', 'name email')
    .populate('reportable', 'title content user');
  
  // Add reportableType for easier identification
  if (report && report.reportable) {
    report.reportable.reportableType = report.reportableModel;
  }
  
  return report;
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
  await Report.findByIdAndDelete(reportId);
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
 * Resolve a report (change status from pending to resolved)
 * @param {ObjectId} reportId
 * @param {Array} resolvedActions - Optional actions taken to resolve the report
 * @returns {Promise<Report>}
 */
const resolveReport = async (reportId, resolvedActions = []) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  
  if (report.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Report is not in pending status');
  }
  
  report.status = 'resolved';
  if (resolvedActions && resolvedActions.length > 0) {
    report.resolvedActions = resolvedActions;
  }
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

/**
 * Get statistics of users who have been reported
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.sortBy] - Sort option (default = 'reportCount:desc')
 * @returns {Promise<Object>}
 */
const getReportedUsersStats = async (options = {}) => {
  const { limit = 10, page = 1, sortBy = 'reportCount:desc' } = options;
  
  // Aggregate pipeline to get user statistics
  const pipeline = [
    // Group by user and count reports
    {
      $group: {
        _id: '$user',
        reportCount: { $sum: 1 },
        pendingReports: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        resolvedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        // Get the latest report for each user
        latestReport: { $last: '$$ROOT' },
        // Get all report reasons
        reasons: { $push: '$reason' },
        // Get all resolved actions
        resolvedActions: { $push: '$resolvedActions' }
      }
    },
    // Sort by report count (descending by default)
    {
      $sort: {
        reportCount: -1
      }
    },
    // Skip for pagination
    {
      $skip: (page - 1) * limit
    },
    // Limit results
    {
      $limit: limit
    },
    // Lookup user information
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    // Unwind user info
    {
      $unwind: {
        path: '$userInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    // Project the final structure
    {
      $project: {
        userId: '$_id',
        user: {
          id: '$userInfo._id',
          name: '$userInfo.name',
          email: '$userInfo.email',
          avatar: '$userInfo.avatar'
        },
        reportCount: 1,
        pendingReports: 1,
        resolvedReports: 1,
        latestReport: {
          id: '$latestReport._id',
          title: '$latestReport.title',
          reason: '$latestReport.reason',
          status: '$latestReport.status',
          createdAt: '$latestReport.createdAt'
        },
        reasons: 1,
        resolvedActions: 1
      }
    }
  ];

  // Get total count for pagination
  const totalCountPipeline = [
    {
      $group: {
        _id: '$user'
      }
    },
    {
      $count: 'total'
    }
  ];

  const [results, totalCountResult] = await Promise.all([
    Report.aggregate(pipeline),
    Report.aggregate(totalCountPipeline)
  ]);

  const totalCount = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    results,
    page,
    limit,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
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
  resolveReport,
  getPendingReports,
  getReportedUsersStats,
}; 
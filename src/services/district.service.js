const { District } = require('../models');
const pick = require('../utils/pick');

/**
 * Query for districts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDistricts = async (filter, options) => {
  const filterObj = pick(filter, ['name', 'slug']);
  const result = await District.paginate(filterObj, options);
  return result;
};

/**
 * Get district by id
 * @param {ObjectId} id
 * @returns {Promise<District>}
 */
const getDistrictById = async (id) => {
  return District.findById(id);
};

/**
 * Get district by slug
 * @param {string} slug
 * @returns {Promise<District>}
 */
const getDistrictBySlug = async (slug) => {
  return District.findOne({ slug });
};

module.exports = {
  queryDistricts,
  getDistrictById,
  getDistrictBySlug,
}; 
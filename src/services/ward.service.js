const { Ward, District } = require('../models');
const pick = require('../utils/pick');

/**
 * Query for wards
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWards = async (filter, options) => {
  const filterObj = pick(filter, ['name', 'slug', 'district_id']);
  const result = await Ward.paginate(filterObj, {
    ...options,
    populate: 'district_id',
  });
  return result;
};

/**
 * Get ward by id
 * @param {ObjectId} id
 * @returns {Promise<Ward>}
 */
const getWardById = async (id) => {
  return Ward.findById(id).populate('district_id');
};

/**
 * Get ward by slug
 * @param {string} slug
 * @returns {Promise<Ward>}
 */
const getWardBySlug = async (slug) => {
  return Ward.findOne({ slug }).populate('district_id');
};

/**
 * Get wards by district
 * @param {ObjectId} districtId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getWardsByDistrict = async (districtId, options) => {
  const result = await Ward.paginate({ district_id: districtId }, {
    ...options,
    populate: 'district_id',
  });
  return result;
};

/**
 * Search wards
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchWards = async (filter, options) => {
  const filterObj = pick(filter, ['name', 'slug']);
  const result = await Ward.paginate(filterObj, {
    ...options,
    populate: 'district_id',
  });
  return result;
};

module.exports = {
  queryWards,
  getWardById,
  getWardBySlug,
  getWardsByDistrict,
  searchWards,
}; 
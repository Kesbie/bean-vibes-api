const catchAsync = require('../utils/catchAsync');
const { placeService, contentFilterService, categoryService } = require('../services');
const pick = require('../utils/pick');
const { NOT_FOUND } = require('../utils/error.response');
const { OK, CREATED, NO_CONTENT } = require('../utils/success.response');

// ========================================
// PUBLIC ROUTES (No authentication required)
// ========================================
// Client can only see approved and active places
const getPublicPlaces = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category']);
  console.log('--------------------------------');
  console.log(filter);

  // filter.status = 'active';
  filter.approvalStatus = 'approved';
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.queryPlaces(filter, options);
  new OK(result).send(res);
});

const getPlaces = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Handle category filter - support multiple formats
  if (req.query.category) {
    let categorySlugs = [];
    
    // Format 1: Single category slug
    if (typeof req.query.category === 'string') {
      categorySlugs = req.query.category.split(',').map(slug => slug.trim());
    }
    // Format 2: Array of category slugs (when sent as multiple params)
    else if (Array.isArray(req.query.category)) {
      categorySlugs = req.query.category.flatMap(cat => 
        typeof cat === 'string' ? cat.split(',').map(slug => slug.trim()) : [cat]
      );
    }
    
    // Remove empty strings and duplicates
    categorySlugs = [...new Set(categorySlugs.filter(slug => slug.length > 0))];
    
    if (categorySlugs.length > 0) {
      filter.category = categorySlugs;
    }
  }

  // Handle categories filter (alternative parameter name)
  if (req.query.categories) {
    let categorySlugs = [];
    
    // Format 1: Single category slug
    if (typeof req.query.categories === 'string') {
      categorySlugs = req.query.categories.split(',').map(slug => slug.trim());
    }
    // Format 2: Array of category slugs
    else if (Array.isArray(req.query.categories)) {
      categorySlugs = req.query.categories.flatMap(cat => 
        typeof cat === 'string' ? cat.split(',').map(slug => slug.trim()) : [cat]
      );
    }
    
    // Remove empty strings and duplicates
    categorySlugs = [...new Set(categorySlugs.filter(slug => slug.length > 0))];
    
    if (categorySlugs.length > 0) {
      filter.category = categorySlugs;
    }
  }

  // Non-admin users (including unauthenticated) only see approved places
  filter.approvalStatus = 'approved';

  const result = await placeService.queryPlaces(filter, options);
  new OK(result).send(res);
});

const getPublicPlaceBySlug = catchAsync(async (req, res) => {
  const place = await placeService.getPublicPlaceBySlug(req.params.slug);
  new OK(place).send(res);
});

const getPublicPlace = catchAsync(async (req, res) => {
  const place = await placeService.getPublicPlaceById(req.params.placeId);
  if (!place) {
    return new NOT_FOUND('Place not found').send(res);
  }
  new OK(place).send(res);
});

const searchPlaces = catchAsync(async (req, res) => {
  const { q } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.searchPlaces(q, options);
  new OK(result).send(res);
});

const getTrendingPlaces = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'period']);
  const result = await placeService.getTrendingPlaces(options);
  new OK(result).send(res);
});

const getHotPlacesWeekly = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page']);
  const result = await placeService.getHotPlacesWeekly(options);
  new OK(result).send(res);
});

const getVerifiedPlaces = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.getVerifiedPlaces(options);
  new OK(result).send(res);
});

const getPlacesByCategory = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.getPlacesByCategory(req.params.categoryId, options);
  new OK(result).send(res);
});

const getHotPlacesByCategory = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'period']);
  const result = await placeService.getHotPlacesByCategory(req.params.categoryId, options);
  new OK(result).send(res);
});

// ========================================
// USER ROUTES (Authenticated users)
// ========================================
// Users can only see and manage their own places
const createPlace = catchAsync(async (req, res) => {
  const place = await placeService.createPlace({
    ...req.body,
    createdBy: req.user.id,
  });
  new CREATED(place).send(res);
});

const getUserPlaces = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'approvalStatus']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.getUserPlaces(filter, options, req.user.id);
  new OK(result).send(res);
});

const getMyPlaces = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'approvalStatus']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.getMyPlaces(filter, options, req.user.id);
  new OK(result).send(res);
});

const getUserPlace = catchAsync(async (req, res) => {
  const place = await placeService.getUserPlaceById(req.params.placeId, req.user.id);
  if (!place) {
    throw new NOT_FOUND('Place not found');
  }
  new OK(place).send(res);
});

const updatePlace = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator' || req.user.role === 'superAdmin';
  const place = await placeService.updatePlaceById(req.params.placeId, req.body, req.user.id, isAdmin);
  new OK(place).send(res);
});

const deletePlace = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator' || req.user.role === 'superAdmin';
  await placeService.deletePlaceById(req.params.placeId, req.user.id, isAdmin);
  new NO_CONTENT().send(res);
});

const checkPlaceContent = catchAsync(async (req, res) => {
  const result = await contentFilterService.checkPlaceContent(req.body);
  new OK(result).send(res);
});

// ========================================
// ADMIN ROUTES (Admin/Moderator only)
// ========================================
// Admin can see and manage all places
const getAdminPlaces = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'approvalStatus', 'isVerified', 'createdBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.customSort = {
    approvalStatus: true
  };
  const result = await placeService.getAdminPlaces(filter, options);
  new OK(result).send(res);
});

const getPendingPlaces = catchAsync(async (req, res) => {
  const filter = { approvalStatus: 'pending' };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.queryPlaces(filter, options);
  new OK(result).send(res);
});

const getAdminPlace = catchAsync(async (req, res) => {
  const place = await placeService.getAdminPlaceById(req.params.placeId);
  if (!place) {
    throw new NOT_FOUND('Place not found');
  }
  new OK(place).send(res);
});

const updatePlaceApprovalStatus = catchAsync(async (req, res) => {
  const { status, reason } = req.body;
  const place = await placeService.updatePlaceApprovalStatus(req.params.placeId, status, reason, req.user.id);
  new OK(place).send(res);
});

const updatePlaceRating = catchAsync(async (req, res) => {
  const { averageRating, totalRatings } = req.body;
  const place = await placeService.updatePlaceRating(req.params.placeId, averageRating, totalRatings);
  new OK(place).send(res);
});

module.exports = {
  // Public routes
  getPublicPlaces,
  getPublicPlaceBySlug,
  getPlaces,
  getPublicPlace,
  searchPlaces,
  getTrendingPlaces,
  getHotPlacesWeekly,
  getVerifiedPlaces,
  getPlacesByCategory,
  getHotPlacesByCategory,
  // User routes
  createPlace,
  getUserPlaces,
  getMyPlaces,
  getUserPlace,
  updatePlace,
  deletePlace,
  checkPlaceContent,
  // Admin routes
  getAdminPlaces,
  getPendingPlaces,
  getAdminPlace,
  updatePlaceApprovalStatus,
  updatePlaceRating,
};

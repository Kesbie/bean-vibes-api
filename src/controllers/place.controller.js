const catchAsync = require('../utils/catchAsync');
const { placeService, contentFilterService } = require('../services');
const pick = require('../utils/pick');
const { NOT_FOUND} = require('../utils/error.response');
const { OK, CREATED, NO_CONTENT } = require('../utils/success.response');

// ========================================
// PUBLIC ROUTES (No authentication required)
// ========================================
// Client can only see approved and active places
const getPublicPlaces = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['categories', 'district', 'ward']);
  filter.status = 'active';
  filter.approvalStatus = 'approved';
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeService.queryPlaces(filter, options);
  new OK(result).send(res);
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
    new NOT_FOUND.res('Place not found');
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
    new NOT_FOUND.res('Place not found');
  }
  new OK(place).send(res);
});

const updatePlaceApprovalStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const place = await placeService.updatePlaceApprovalStatus(req.params.placeId, status, req.user.id);
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
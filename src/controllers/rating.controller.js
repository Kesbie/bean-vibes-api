const catchAsync = require('../utils/catchAsync');
const { ratingService } = require('../services');
const { NOT_FOUND } = require('../utils/error.response');
const Rating = require('../models/rating.model');
const { CREATED, OK } = require('../utils/success.response');
/**
 * Get average rating for a place
 */
const getAverageRating = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const ratingInfo = await ratingService.getAverageRating(placeId);
  new OK(ratingInfo).send(res);
});

/**
 * Get detailed rating breakdown for a place
 */
const getRatingBreakdown = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const breakdown = await ratingService.getRatingBreakdown(placeId);
  new OK(breakdown).send(res);
});

/**
 * Get average ratings for each criteria separately
 */
const getCriteriaAverages = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const averages = await ratingService.getCriteriaAverages(placeId);
  new OK(averages).send(res);
});

/**
 * Calculate and update average rating for a place
 */
const updateAverageRating = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const result = await ratingService.calculateAndUpdateAverageRating(placeId);
  new OK(result).send(res);
});

/**
 * Create a new rating
 */
const createRating = catchAsync(async (req, res) => {
  const rating = await Rating.create({ ...req.body, user: req.user.id });

  // Automatically update average rating for the place
  await ratingService.calculateAndUpdateAverageRating(rating.place);

  new CREATED(rating).send(res);
});

/**
 * Update a rating
 */
const updateRating = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const rating = await Rating.findByIdAndUpdate(ratingId, req.body, { new: true });

  if (!rating) {
    throw new NOT_FOUND('Rating not found');
  }

  // Automatically update average rating for the place
  await ratingService.calculateAndUpdateAverageRating(rating.place);

  new OK(rating).send(res);
});

/**
 * Delete a rating
 */
const deleteRating = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const rating = await Rating.findByIdAndDelete(ratingId);

  if (!rating) {
    throw new NOT_FOUND('Rating not found');
  }

  // Automatically update average rating for the place
  await ratingService.calculateAndUpdateAverageRating(rating.place);

  new OK().send(res);
});

/**
 * Get all ratings for a place
 */
const getRatingsByPlace = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const ratings = await Rating.find({ place: placeId }).populate('user', 'name email');
  new OK(ratings).send(res);
});

const getRatingPlaceByUser = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const rating = await Rating.findOne({ place: placeId, user: req.user.id });
  new OK(rating).send(res);
});

module.exports = {
  getAverageRating,
  getRatingBreakdown,
  getCriteriaAverages,
  updateAverageRating,
  createRating,
  updateRating,
  deleteRating,
  getRatingsByPlace,
  getRatingPlaceByUser,
};

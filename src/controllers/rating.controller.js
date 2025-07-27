const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ratingService } = require('../services');
const { successResponse } = require('../utils/success.response');
const Rating = require('../models/rating.model');

/**
 * Get average rating for a place
 */
const getAverageRating = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const ratingInfo = await ratingService.getAverageRating(placeId);
  res.status(httpStatus.OK).json(successResponse('Lấy điểm đánh giá trung bình thành công', ratingInfo));
});

/**
 * Get detailed rating breakdown for a place
 */
const getRatingBreakdown = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const breakdown = await ratingService.getRatingBreakdown(placeId);
  res.status(httpStatus.OK).json(successResponse('Lấy chi tiết đánh giá thành công', breakdown));
});

/**
 * Calculate and update average rating for a place
 */
const updateAverageRating = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const result = await ratingService.calculateAndUpdateAverageRating(placeId);
  res.status(httpStatus.OK).json(successResponse('Cập nhật điểm đánh giá trung bình thành công', result));
});

/**
 * Create a new rating
 */
const createRating = catchAsync(async (req, res) => {
  const rating = await Rating.create(req.body);
  
  // Automatically update average rating for the place
  await ratingService.calculateAndUpdateAverageRating(rating.place);
  
  res.status(httpStatus.CREATED).json(successResponse('Tạo đánh giá thành công', rating));
});

/**
 * Update a rating
 */
const updateRating = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const rating = await Rating.findByIdAndUpdate(ratingId, req.body, { new: true });
  
  if (!rating) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Không tìm thấy đánh giá' });
    return;
  }
  
  // Automatically update average rating for the place
  await ratingService.calculateAndUpdateAverageRating(rating.place);
  
  res.status(httpStatus.OK).json(successResponse('Cập nhật đánh giá thành công', rating));
});

/**
 * Delete a rating
 */
const deleteRating = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const rating = await Rating.findByIdAndDelete(ratingId);
  
  if (!rating) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Không tìm thấy đánh giá' });
    return;
  }
  
  // Automatically update average rating for the place
  await ratingService.calculateAndUpdateAverageRating(rating.place);
  
  res.status(httpStatus.OK).json(successResponse('Xóa đánh giá thành công'));
});

/**
 * Get all ratings for a place
 */
const getRatingsByPlace = catchAsync(async (req, res) => {
  const { placeId } = req.params;
  const ratings = await Rating.find({ place: placeId }).populate('user', 'name email');
  res.status(httpStatus.OK).json(successResponse('Lấy danh sách đánh giá thành công', ratings));
});

module.exports = {
  getAverageRating,
  getRatingBreakdown,
  updateAverageRating,
  createRating,
  updateRating,
  deleteRating,
  getRatingsByPlace,
}; 
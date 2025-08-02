const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/error.response');
const { OK, NOT_FOUND } = require('../utils/success.response');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(review);
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['place', 'user', 'isAnonymous']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviews(filter, options);
  res.send(result);
});

const getReview = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.reviewId);
  if (!review) {
    return new NOT_FOUND('Review not found').send(res);
  }
  new OK(review).send(res);
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReviewById(req.params.reviewId, req.body);
  res.send(review);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.reviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getReviewsByPlace = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getReviewsByPlace(req.params.placeId, options);
  new OK(result).send(res);
});

const getReviewsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getReviewsByUser(req.params.userId, options);
  res.send(result);
});

const searchReviews = catchAsync(async (req, res) => {
  const { q } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.searchReviews(q, options);
  res.send(result);
});

const getAnonymousReviews = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getAnonymousReviews(options);
  res.send(result);
});

const addReactionToReview = catchAsync(async (req, res) => {
  const { reactionId } = req.body;
  const review = await reviewService.addReactionToReview(req.params.reviewId, reactionId);
  res.send(review);
});

const removeReactionFromReview = catchAsync(async (req, res) => {
  const { reactionId } = req.body;
  const review = await reviewService.removeReactionFromReview(req.params.reviewId, reactionId);
  res.send(review);
});

const addCommentToReview = catchAsync(async (req, res) => {
  const { content } = req.body;
  const comment = await reviewService.addCommentToReview(req.params.reviewId, {
    content,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(comment);
});

const incrementViewCount = catchAsync(async (req, res) => {
  const review = await reviewService.incrementViewCount(req.params.reviewId);
  new OK(review).send(res);
});

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getReviewsByPlace,
  getReviewsByUser,
  searchReviews,
  getAnonymousReviews,
  addReactionToReview,
  removeReactionFromReview,
  addCommentToReview,
  incrementViewCount,
}; 
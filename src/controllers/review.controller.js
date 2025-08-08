const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');
const pick = require('../utils/pick');
const { BAD_REQUEST } = require('../utils/error.response');
const { OK, CREATED, NOT_FOUND, NO_CONTENT } = require('../utils/success.response');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview({
    ...req.body,
    user: req.user.id,
  });
  new CREATED(review).send(res);
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['place', 'user', 'isAnonymous']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'includeHidden']);
  const result = await reviewService.queryReviews(filter, options);
  new OK(result).send(res);
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
  new OK(review).send(res);
}); 

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.reviewId);
  new NO_CONTENT().send(res);
});

const hideReview = catchAsync(async (req, res) => {
  const review = await reviewService.hideReviewById(req.params.reviewId);
  new OK(review).send(res);
});

const unhideReview = catchAsync(async (req, res) => {
  const review = await reviewService.unhideReviewById(req.params.reviewId);
  new OK(review).send(res);
});

const getReviewsByPlace = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getReviewsByPlace(req.params.placeId, options);
  new OK(result).send(res);
});

const getReviewsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getReviewsByUser(req.params.userId, options);
  new OK(result).send(res);
});

const searchReviews = catchAsync(async (req, res) => {
  const { q } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.searchReviews(q, options);
  new OK(result).send(res);
});

const getAnonymousReviews = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getAnonymousReviews(options);
  new OK(result).send(res);
});

const addReactionToReview = catchAsync(async (req, res) => {
  const { reactionId } = req.body;
  const review = await reviewService.addReactionToReview(req.params.reviewId, reactionId);
  new OK(review).send(res);
});

const removeReactionFromReview = catchAsync(async (req, res) => {
  const { reactionId } = req.body;
  const review = await reviewService.removeReactionFromReview(req.params.reviewId, reactionId);
  new OK(review).send(res);
});

const addCommentToReview = catchAsync(async (req, res) => {
  const { content } = req.body;
  const comment = await reviewService.addCommentToReview(req.params.reviewId, {
    content,
    user: req.user.id,
  });
  new CREATED(comment).send(res);
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
  hideReview,
  unhideReview,
  getReviewsByPlace,
  getReviewsByUser,
  searchReviews,
  getAnonymousReviews,
  addReactionToReview,
  removeReactionFromReview,
  addCommentToReview,
  incrementViewCount,
}; 
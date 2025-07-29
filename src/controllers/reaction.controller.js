const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reactionService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/error.response');

const createReaction = catchAsync(async (req, res) => {
  const reaction = await reactionService.createReaction({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(reaction);
});

const getReactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['review', 'comment', 'user', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reactionService.queryReactions(filter, options);
  res.send(result);
});

const getReaction = catchAsync(async (req, res) => {
  const reaction = await reactionService.getReactionById(req.params.reactionId);
  if (!reaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reaction not found');
  }
  res.send(reaction);
});

const updateReaction = catchAsync(async (req, res) => {
  const reaction = await reactionService.updateReactionById(req.params.reactionId, req.body);
  res.send(reaction);
});

const deleteReaction = catchAsync(async (req, res) => {
  await reactionService.deleteReactionById(req.params.reactionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getReactionsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reactionService.getReactionsByUser(req.params.userId, options);
  res.send(result);
});

const getReactionsByReview = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reactionService.getReactionsByReview(req.params.reviewId, options);
  res.send(result);
});

const getReactionsByComment = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reactionService.getReactionsByComment(req.params.commentId, options);
  res.send(result);
});

const getReactionsByType = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reactionService.getReactionsByType(req.params.type, options);
  res.send(result);
});

const toggleReaction = catchAsync(async (req, res) => {
  const { reviewId, commentId, type } = req.body;
  const reaction = await reactionService.toggleReaction(req.user.id, reviewId, commentId, type);
  res.send(reaction);
});

const getReactionCount = catchAsync(async (req, res) => {
  const { reviewId, commentId, type } = req.query;
  const count = await reactionService.getReactionCount(reviewId, commentId, type);
  res.send({ count });
});

module.exports = {
  createReaction,
  getReactions,
  getReaction,
  updateReaction,
  deleteReaction,
  getReactionsByUser,
  getReactionsByReview,
  getReactionsByComment,
  getReactionsByType,
  toggleReaction,
  getReactionCount,
}; 
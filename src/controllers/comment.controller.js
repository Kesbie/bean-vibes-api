const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/error.response');

const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(comment);
});

const getComments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['review', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.queryComments(filter, options);
  res.send(result);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  res.send(comment);
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCommentsByReview = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.getCommentsByReviewId(req.params.reviewId, options);
  res.send(result);
});

const getCommentsByUser = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.getCommentsByUserId(req.params.userId, options);
  res.send(result);
});

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
  getCommentsByReview,
  getCommentsByUser,
}; 
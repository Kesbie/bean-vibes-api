const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { moderatorRequestService } = require('../services');
const pick = require('../utils/pick');

const createModeratorRequest = catchAsync(async (req, res) => {
  const request = await moderatorRequestService.createModeratorRequest({
    ...req.body,
    user: req.user.id,
  });
  res.status(httpStatus.CREATED).send(request);
});

const getModeratorRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await moderatorRequestService.queryModeratorRequests(filter, options);
  res.send(result);
});

const getModeratorRequest = catchAsync(async (req, res) => {
  const request = await moderatorRequestService.getModeratorRequestById(req.params.requestId);
  res.send(request);
});

const getMyModeratorRequest = catchAsync(async (req, res) => {
  const request = await moderatorRequestService.getModeratorRequestByUser(req.user.id);
  res.send(request);
});

const updateModeratorRequest = catchAsync(async (req, res) => {
  const request = await moderatorRequestService.updateModeratorRequestById(
    req.params.requestId,
    req.body
  );
  res.send(request);
});

const deleteModeratorRequest = catchAsync(async (req, res) => {
  await moderatorRequestService.deleteModeratorRequestById(req.params.requestId);
  res.status(httpStatus.NO_CONTENT).send();
});

const reviewModeratorRequest = catchAsync(async (req, res) => {
  const request = await moderatorRequestService.reviewModeratorRequest(
    req.params.requestId,
    req.body,
    req.user.id
  );
  res.send(request);
});

const getPendingModeratorRequests = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await moderatorRequestService.getPendingModeratorRequests(options);
  res.send(result);
});

const getModeratorRequestsByStatus = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await moderatorRequestService.getModeratorRequestsByStatus(
    req.params.status,
    options
  );
  res.send(result);
});

const checkCanSubmitRequest = catchAsync(async (req, res) => {
  const result = await moderatorRequestService.canUserSubmitRequest(req.user.id);
  res.send(result);
});

module.exports = {
  createModeratorRequest,
  getModeratorRequests,
  getModeratorRequest,
  getMyModeratorRequest,
  updateModeratorRequest,
  deleteModeratorRequest,
  reviewModeratorRequest,
  getPendingModeratorRequests,
  getModeratorRequestsByStatus,
  checkCanSubmitRequest,
}; 
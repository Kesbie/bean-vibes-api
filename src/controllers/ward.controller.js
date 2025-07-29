const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { wardService } = require('../services');

const getWards = catchAsync(async (req, res) => {
  const result = await wardService.queryWards(req.query);
  res.status(httpStatus.OK).send(result);
});

const getWard = catchAsync(async (req, res) => {
  const ward = await wardService.getWardById(req.params.wardId);
  res.status(httpStatus.OK).send(ward);
});

const getWardBySlug = catchAsync(async (req, res) => {
  const ward = await wardService.getWardBySlug(req.params.slug);
  res.status(httpStatus.OK).send(ward);
});

const getWardsByDistrict = catchAsync(async (req, res) => {
  const result = await wardService.getWardsByDistrict(req.params.districtId, req.query);
  res.status(httpStatus.OK).send(result);
});

const searchWards = catchAsync(async (req, res) => {
  const result = await wardService.searchWards(req.query);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getWards,
  getWard,
  getWardBySlug,
  getWardsByDistrict,
  searchWards,
}; 
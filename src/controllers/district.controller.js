const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { districtService } = require('../services');

const getDistricts = catchAsync(async (req, res) => {
  const result = await districtService.queryDistricts(req.query);
  res.status(httpStatus.OK).send(result);
});

const getDistrict = catchAsync(async (req, res) => {
  const district = await districtService.getDistrictById(req.params.districtId);
  res.status(httpStatus.OK).send(district);
});

const getDistrictBySlug = catchAsync(async (req, res) => {
  const district = await districtService.getDistrictBySlug(req.params.slug);
  res.status(httpStatus.OK).send(district);
});

module.exports = {
  getDistricts,
  getDistrict,
  getDistrictBySlug,
}; 
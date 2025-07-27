const { addressService } = require('../services');
const { OK, CREATED, NO_CONTENT } = require('../utils/success.response');
const catchAsync = require('../utils/catchAsync');
const districts = require('../data/districts.json');
const wards = require('../data/wards.json');

const hanoiDistricts = districts.filter((district) => district.parent_code === '01');
const hanoiDistrictsData = hanoiDistricts.map((district) => ({
  name: district.name_with_type,
  slug: district.slug,
}));
const hanoiDistrictCodes = hanoiDistricts.map((district) => district.code);
const hanoiWards = wards.filter((ward) => hanoiDistrictCodes.includes(ward.parent_code));

const getAddressByPlaceId = catchAsync(async (req, res) => {
  const address = await addressService.getAddressByPlaceId(req.params.placeId);
  new OK(address).send(res);
});

const importDistricts = catchAsync(async (req, res) => {
  const districts = await addressService.importDistricts(hanoiDistrictsData);
  new CREATED(districts).send(res);
});

const importWards = catchAsync(async (req, res) => {
  const wards = await addressService.importWards(hanoiDistricts, hanoiWards);
  new CREATED(wards).send(res);
});

module.exports = {
  getAddressByPlaceId,
  importDistricts,
  importWards,
};

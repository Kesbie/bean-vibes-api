const { BAD_REQUEST, NOT_FOUND } = require('../utils/error.response');
const { Address, District, Ward } = require('../models');
const slugify = require('slugify');

const importDistricts = async (districtsData) => {
  const districts = await District.insertMany(districtsData);
  if (!districts) {
    throw new BAD_REQUEST('Failed to import districts');
  }
  return districts;
};

const importWards = async (districtsData, wardsData) => {
  const districts = await District.find({});

  const districtCodes = districtsData.map((district) => {
    const districtId = districts.find((d) => d.name === district.name_with_type);

    return {
      code: district.code,
      district_id: districtId.id,
    };
  });

  const wardWithDistrictIds = districtCodes.reduce((acc, cur) => {
    const wards = wardsData
      .filter((ward) => ward.parent_code === cur.code)
      .map((ward) => {
        return {
          name: ward.name_with_type,
          slug: ward.slug,
          district_id: cur.district_id,
        };
      });

    return [...acc, ...wards];
  }, []);

  const wards = await Ward.insertMany(wardWithDistrictIds);
  if (!wards) {
    throw new BAD_REQUEST('Failed to import wards');
  }
  return wards;
};

const createAddress = async (addressBody) => {
  const isPlaceIdTaken = await Address.isPlaceIdTaken(addressBody.place_id);
  if (isPlaceIdTaken) {
    throw new BAD_REQUEST('Place ID already taken');
  }

  const address = await Address.create(addressBody);
  return address;
};

const getAddressByPlaceId = async (placeId) => {
  const address = await Address.findOne({ place_id: placeId });
  if (!address) {
    throw new NOT_FOUND('Address not found');
  }
  return address;
};

module.exports = {
  createAddress,
  getAddressByPlaceId,
  importDistricts,
  importWards,
};

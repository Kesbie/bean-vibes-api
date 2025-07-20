const express = require('express');
const addressController = require('../../controllers/address.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/import-districts', auth('importDistricts'), addressController.importDistricts);
router.post('/import-wards', auth('importWards'), addressController.importWards);

module.exports = router;

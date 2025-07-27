const express = require('express');
const validate = require('../../middlewares/validate');
const { ratingValidation } = require('../../validations');
const { ratingController } = require('../../controllers');

const router = express.Router();

/**
 * @route GET /v1/rating/:placeId/average
 * @desc Get average rating for a place
 * @access Public
 */
router.get('/:placeId/average', validate(ratingValidation.getAverageRating), ratingController.getAverageRating);

/**
 * @route GET /v1/rating/:placeId/breakdown
 * @desc Get detailed rating breakdown for a place
 * @access Public
 */
router.get('/:placeId/breakdown', validate(ratingValidation.getRatingBreakdown), ratingController.getRatingBreakdown);

/**
 * @route PUT /v1/rating/:placeId/update-average
 * @desc Calculate and update average rating for a place
 * @access Public
 */
router.put('/:placeId/update-average', validate(ratingValidation.updateAverageRating), ratingController.updateAverageRating);

/**
 * @route GET /v1/rating/:placeId/ratings
 * @desc Get all ratings for a place
 * @access Public
 */
router.get('/:placeId/ratings', validate(ratingValidation.getRatingsByPlace), ratingController.getRatingsByPlace);

/**
 * @route POST /v1/rating
 * @desc Create a new rating
 * @access Public
 */
router.post('/', validate(ratingValidation.createRating), ratingController.createRating);

/**
 * @route PUT /v1/rating/:ratingId
 * @desc Update a rating
 * @access Public
 */
router.put('/:ratingId', validate(ratingValidation.updateRating), ratingController.updateRating);

/**
 * @route DELETE /v1/rating/:ratingId
 * @desc Delete a rating
 * @access Public
 */
router.delete('/:ratingId', validate(ratingValidation.deleteRating), ratingController.deleteRating);

module.exports = router; 
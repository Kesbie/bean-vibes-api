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

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Rating management
 */

/**
 * @swagger
 * /rating/{placeId}/average:
 *   get:
 *     summary: Get average rating for a place
 *     description: Get the average rating for a specific place
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 5
 *                   description: Average rating
 *                 totalRatings:
 *                   type: integer
 *                   minimum: 0
 *                   description: Total number of ratings
 *               example:
 *                 averageRating: 4.5
 *                 totalRatings: 25
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /rating/{placeId}/breakdown:
 *   get:
 *     summary: Get rating breakdown for a place
 *     description: Get detailed rating breakdown showing count for each rating level
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 breakdown:
 *                   type: object
 *                   properties:
 *                     "1":
 *                       type: integer
 *                       description: Number of 1-star ratings
 *                     "2":
 *                       type: integer
 *                       description: Number of 2-star ratings
 *                     "3":
 *                       type: integer
 *                       description: Number of 3-star ratings
 *                     "4":
 *                       type: integer
 *                       description: Number of 4-star ratings
 *                     "5":
 *                       type: integer
 *                       description: Number of 5-star ratings
 *                 totalRatings:
 *                   type: integer
 *                   description: Total number of ratings
 *               example:
 *                 breakdown:
 *                   "1": 2
 *                   "2": 3
 *                   "3": 5
 *                   "4": 8
 *                   "5": 12
 *                 totalRatings: 30
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /rating/{placeId}/update-average:
 *   put:
 *     summary: Update average rating for a place
 *     description: Calculate and update the average rating for a place
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 5
 *                   description: Updated average rating
 *                 totalRatings:
 *                   type: integer
 *                   minimum: 0
 *                   description: Total number of ratings
 *               example:
 *                 averageRating: 4.3
 *                 totalRatings: 25
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /rating/{placeId}/ratings:
 *   get:
 *     summary: Get all ratings for a place
 *     description: Get all individual ratings for a specific place
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt, value)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of ratings
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /rating:
 *   post:
 *     summary: Create a new rating
 *     description: Create a new rating for a place
 *     tags: [Ratings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - placeId
 *             properties:
 *               value:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating value from 1 to 5
 *               placeId:
 *                 type: string
 *                 description: ID of the place being rated
 *               userId:
 *                 type: string
 *                 description: ID of the user giving the rating
 *             example:
 *               value: 5
 *               placeId: "5ebac534954b54139806c113"
 *               userId: "5ebac534954b54139806c112"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /rating/{ratingId}:
 *   put:
 *     summary: Update a rating
 *     description: Update an existing rating
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated rating value from 1 to 5
 *             example:
 *               value: 4
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a rating
 *     description: Delete an existing rating
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */ 
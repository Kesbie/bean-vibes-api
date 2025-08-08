const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reviewValidation } = require('../../validations');
const { reviewController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route('/search')
  .get(validate(reviewValidation.searchReviews), reviewController.searchReviews);

router
  .route('/anonymous')
  .get(validate(reviewValidation.getAnonymousReviews), reviewController.getAnonymousReviews);

router
  .route('/place/:placeId')
  .get(validate(reviewValidation.getReviewsByPlace), reviewController.getReviewsByPlace);

router
  .route('/user/:userId')
  .get(validate(reviewValidation.getReviewsByUser), reviewController.getReviewsByUser);

router
  .route('/:reviewId')
  .get(validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(), validate(reviewValidation.deleteReview), reviewController.deleteReview);

// Admin-only routes for hiding/unhiding reviews
router
  .route('/:reviewId/hide')
  .patch(auth('manageHiddenReviews'), validate(reviewValidation.hideReview), reviewController.hideReview);

router
  .route('/:reviewId/unhide')
  .patch(auth('manageHiddenReviews'), validate(reviewValidation.unhideReview), reviewController.unhideReview);

router
  .route('/:reviewId/reactions')
  .post(auth(), validate(reviewValidation.addReactionToReview), reviewController.addReactionToReview)
  .delete(auth(), validate(reviewValidation.removeReactionFromReview), reviewController.removeReactionFromReview);

router
  .route('/:reviewId/comments')
  .post(auth(), validate(reviewValidation.addCommentToReview), reviewController.addCommentToReview);

router
  .route('/:reviewId/view')
  .post(reviewController.incrementViewCount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Create a new review for a place (authenticated users only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - rating
 *               - placeId
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: Review content
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               placeId:
 *                 type: string
 *                 description: ID of the place being reviewed
 *               isAnonymous:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to post anonymously
 *             example:
 *               content: "Great coffee and atmosphere! The staff is friendly and the coffee is excellent."
 *               rating: 5
 *               placeId: "5ebac534954b54139806c113"
 *               isAnonymous: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all reviews
 *     description: Get all reviews with optional filtering
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: placeId
 *         schema:
 *           type: string
 *         description: Filter by place ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: isAnonymous
 *         schema:
 *           type: boolean
 *         description: Filter by anonymous status
 *       - in: query
 *         name: includeHidden
 *         schema:
 *           type: boolean
 *         description: Include hidden reviews (admin only)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt, rating, helpful)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reviews
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
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /reviews/search:
 *   get:
 *     summary: Search reviews
 *     description: Search reviews by content
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: placeId
 *         schema:
 *           type: string
 *         description: Filter by place ID
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of results
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
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /reviews/anonymous:
 *   get:
 *     summary: Get anonymous reviews
 *     description: Get all anonymous reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: placeId
 *         schema:
 *           type: string
 *         description: Filter by place ID
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reviews
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
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /reviews/place/{placeId}:
 *   get:
 *     summary: Get reviews by place
 *     description: Get all reviews for a specific place
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: isAnonymous
 *         schema:
 *           type: boolean
 *         description: Filter by anonymous status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt, rating, helpful)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reviews
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
 * /reviews/user/{userId}:
 *   get:
 *     summary: Get reviews by user
 *     description: Get all reviews created by a specific user
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: isAnonymous
 *         schema:
 *           type: boolean
 *         description: Filter by anonymous status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt, rating)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reviews
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
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get review by ID
 *     description: Get details of a specific review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a review
 *     description: Update a review (only by the author)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: Review content
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               isAnonymous:
 *                 type: boolean
 *                 description: Whether to post anonymously
 *             example:
 *               content: "Updated review content"
 *               rating: 4
 *               isAnonymous: false
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a review
 *     description: Delete a review (only by the author)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /reviews/{reviewId}/hide:
 *   patch:
 *     summary: Hide a review (admin only)
 *     description: Hide a review from public view (admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 * /reviews/{reviewId}/unhide:
 *   patch:
 *     summary: Unhide a review (admin only)
 *     description: Make a hidden review visible again (admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /reviews/{reviewId}/reactions:
 *   post:
 *     summary: Add reaction to review
 *     description: Add a reaction to a review (authenticated users only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, love, helpful, funny]
 *                 description: Type of reaction
 *             example:
 *               type: "like"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Remove reaction from review
 *     description: Remove a reaction from a review (authenticated users only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, love, helpful, funny]
 *                 description: Type of reaction to remove
 *             example:
 *               type: "like"
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /reviews/{reviewId}/comments:
 *   post:
 *     summary: Add comment to review
 *     description: Add a comment to a review (authenticated users only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Comment content
 *             example:
 *               content: "I agree, this place is amazing!"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */ 
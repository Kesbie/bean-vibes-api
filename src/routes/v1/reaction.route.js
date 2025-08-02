const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reactionValidation } = require('../../validations');
const { reactionController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reactionValidation.createReaction), reactionController.createReaction)
  .get(validate(reactionValidation.getReactions), reactionController.getReactions);

router
  .route('/toggle')
  .post(auth(), validate(reactionValidation.toggleReaction), reactionController.toggleReaction);

router
  .route('/count')
  .get(validate(reactionValidation.getReactionCount), reactionController.getReactionCount);

router
  .route('/user/:userId')
  .get(validate(reactionValidation.getReactionsByUser), reactionController.getReactionsByUser);

router
  .route('/review/:reviewId')
  .get(validate(reactionValidation.getReactionsByReview), reactionController.getReactionsByReview);

router
  .route('/comment/:commentId')
  .get(validate(reactionValidation.getReactionsByComment), reactionController.getReactionsByComment);

router
  .route('/type/:type')
  .get(validate(reactionValidation.getReactionsByType), reactionController.getReactionsByType);

router
  .route('/:reactionId')
  .get(validate(reactionValidation.getReaction), reactionController.getReaction)
  .patch(auth(), validate(reactionValidation.updateReaction), reactionController.updateReaction)
  .delete(auth(), validate(reactionValidation.deleteReaction), reactionController.deleteReaction);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reactions
 *   description: Reaction management
 */

/**
 * @swagger
 * /reactions:
 *   post:
 *     summary: Create a new reaction
 *     description: Create a new reaction on a review or comment (authenticated users only)
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - targetType
 *               - targetId
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, love, helpful, funny]
 *                 description: Type of reaction
 *               targetType:
 *                 type: string
 *                 enum: [review, comment]
 *                 description: Type of target (review or comment)
 *               targetId:
 *                 type: string
 *                 description: ID of the review or comment
 *             example:
 *               type: "like"
 *               targetType: "review"
 *               targetId: "5ebac534954b54139806c115"
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
 *   get:
 *     summary: Get all reactions
 *     description: Get all reactions with optional filtering
 *     tags: [Reactions]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [like, love, helpful, funny]
 *         description: Filter by reaction type
 *       - in: query
 *         name: targetType
 *         schema:
 *           type: string
 *           enum: [review, comment]
 *         description: Filter by target type
 *       - in: query
 *         name: targetId
 *         schema:
 *           type: string
 *         description: Filter by target ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reactions
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
 * /reactions/toggle:
 *   post:
 *     summary: Toggle reaction
 *     description: Toggle a reaction (add if not exists, remove if exists)
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - targetType
 *               - targetId
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, love, helpful, funny]
 *                 description: Type of reaction
 *               targetType:
 *                 type: string
 *                 enum: [review, comment]
 *                 description: Type of target (review or comment)
 *               targetId:
 *                 type: string
 *                 description: ID of the review or comment
 *             example:
 *               type: "like"
 *               targetType: "review"
 *               targetId: "5ebac534954b54139806c115"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 action:
 *                   type: string
 *                   enum: [added, removed]
 *                   description: Action performed
 *                 reaction:
 *                   $ref: '#/components/schemas/Reaction'
 *               example:
 *                 action: "added"
 *                 reaction:
 *                   id: "5ebac534954b54139806c118"
 *                   type: "like"
 *                   reviewId: "5ebac534954b54139806c115"
 *                   userId: "5ebac534954b54139806c112"
 *                   createdAt: "2020-05-12T16:18:04.793Z"
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /reactions/count:
 *   get:
 *     summary: Get reaction count
 *     description: Get reaction count for a specific target
 *     tags: [Reactions]
 *     parameters:
 *       - in: query
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [review, comment]
 *         description: Type of target
 *       - in: query
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [like, love, helpful, funny]
 *         description: Filter by reaction type
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   minimum: 0
 *                   description: Total reaction count
 *                 breakdown:
 *                   type: object
 *                   properties:
 *                     like:
 *                       type: integer
 *                       description: Number of like reactions
 *                     love:
 *                       type: integer
 *                       description: Number of love reactions
 *                     helpful:
 *                       type: integer
 *                       description: Number of helpful reactions
 *                     funny:
 *                       type: integer
 *                       description: Number of funny reactions
 *               example:
 *                 count: 15
 *                 breakdown:
 *                   like: 8
 *                   love: 4
 *                   helpful: 2
 *                   funny: 1
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /reactions/user/{userId}:
 *   get:
 *     summary: Get reactions by user
 *     description: Get all reactions created by a specific user
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [like, love, helpful, funny]
 *         description: Filter by reaction type
 *       - in: query
 *         name: targetType
 *         schema:
 *           type: string
 *           enum: [review, comment]
 *         description: Filter by target type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reactions
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
 * /reactions/review/{reviewId}:
 *   get:
 *     summary: Get reactions by review
 *     description: Get all reactions for a specific review
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [like, love, helpful, funny]
 *         description: Filter by reaction type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reactions
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
 * /reactions/comment/{commentId}:
 *   get:
 *     summary: Get reactions by comment
 *     description: Get all reactions for a specific comment
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [like, love, helpful, funny]
 *         description: Filter by reaction type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reactions
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
 * /reactions/type/{type}:
 *   get:
 *     summary: Get reactions by type
 *     description: Get all reactions of a specific type
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [like, love, helpful, funny]
 *         description: Reaction type
 *       - in: query
 *         name: targetType
 *         schema:
 *           type: string
 *           enum: [review, comment]
 *         description: Filter by target type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reactions
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
 * /reactions/{reactionId}:
 *   get:
 *     summary: Get reaction by ID
 *     description: Get details of a specific reaction
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reaction ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a reaction
 *     description: Update a reaction (only by the author)
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reaction ID
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
 *                 description: Updated reaction type
 *             example:
 *               type: "love"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
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
 *     summary: Delete a reaction
 *     description: Delete a reaction (only by the author)
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reaction ID
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
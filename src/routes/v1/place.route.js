const express = require('express');
const { auth, optionalAuth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { placeValidation } = require('../../validations');
const { placeController } = require('../../controllers');
const { upload } = require('../../config/multer');

const router = express.Router();

router
  .route('/')
  .get(validate(placeValidation.getPublicPlaces), placeController.getPlaces);

router
  .route('/admin')
  .get(auth('managePlaces'), validate(placeValidation.getAdminPlaces), placeController.getAdminPlaces);

router.route('/slug/:slug')
  .get(validate(placeValidation.getPublicPlaceBySlug), placeController.getPublicPlaceBySlug);

router
  .route('/:placeId/info')
  .get(validate(placeValidation.getPublicPlace), placeController.getPublicPlace);

router
  .route('/search')
  .get(validate(placeValidation.searchPlaces), placeController.searchPlaces);

router
  .route('/trending')
  .get(validate(placeValidation.getTrendingPlaces), placeController.getTrendingPlaces);

router
  .route('/hot-weekly')
  .get(validate(placeValidation.getHotPlacesWeekly), placeController.getHotPlacesWeekly);

router
  .route('/verified')
  .get(validate(placeValidation.getVerifiedPlaces), placeController.getVerifiedPlaces);

router
  .route('/category/:categoryId')
  .get(validate(placeValidation.getPlacesByCategory), placeController.getPlacesByCategory);

router
  .route('/public/category/:categoryId/hot')
  .get(validate(placeValidation.getHotPlacesByCategory), placeController.getHotPlacesByCategory);

// ========================================
// USER ROUTES (Authenticated users)
// ========================================
// Users can only see and manage their own places
router
  .route('/')
  .post(auth(), validate(placeValidation.createPlace), placeController.createPlace)
  .get(auth(), validate(placeValidation.getUserPlaces), placeController.getUserPlaces);

router
  .route('/my-places')
  .get(auth(), validate(placeValidation.getMyPlaces), placeController.getMyPlaces);

router
  .route('/:placeId')
  .get(auth(), validate(placeValidation.getUserPlace), placeController.getUserPlace)
  .patch(auth('manageOwnPlaces'), validate(placeValidation.updatePlace), placeController.updatePlace)
  .delete(auth('manageOwnPlaces'), validate(placeValidation.deletePlace), placeController.deletePlace);

// Content checking (available for users)
router
  .route('/check-content')
  .post(validate(placeValidation.checkPlaceContent), placeController.checkPlaceContent);

// ========================================
// ADMIN ROUTES (Admin/Moderator only)
// ========================================
// Admin can see and manage all places

router
  .route('/admin/pending')
  .get(auth('approvePlaces'), validate(placeValidation.getPendingPlaces), placeController.getPendingPlaces);

router
  .route('/admin/:placeId')
  .get(auth('managePlaces'), validate(placeValidation.getAdminPlace), placeController.getAdminPlace)
  .patch(auth('managePlaces'), validate(placeValidation.updatePlace), placeController.updatePlace)
  .delete(auth('managePlaces'), validate(placeValidation.deletePlace), placeController.deletePlace);

router
  .route('/:placeId/approval-status')
  .post(auth('approvePlaces'), validate(placeValidation.updatePlaceApprovalStatus), placeController.updatePlaceApprovalStatus);

router
  .route('/admin/:placeId/rating')
  .patch(auth('managePlaces'), validate(placeValidation.updatePlaceRating), placeController.updatePlaceRating);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Coffee shop and place management
 */

/**
 * @swagger
 * /places/public:
 *   get:
 *     summary: Get all public places
 *     description: Get all approved and active places (no authentication required)
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Place name
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: User latitude for distance calculation
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: User longitude for distance calculation
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Search radius in kilometers
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (rating, distance, createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 * /places/public/{placeId}:
 *   get:
 *     summary: Get a public place by ID
 *     description: Get details of a specific approved place (no authentication required)
 *     tags: [Places]
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
 *               $ref: '#/components/schemas/Place'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /places/public/search:
 *   get:
 *     summary: Search places
 *     description: Search for places by name, description, or address (no authentication required)
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: User latitude for distance calculation
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: User longitude for distance calculation
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
 * /places/public/trending:
 *   get:
 *     summary: Get trending places
 *     description: Get places that are currently trending based on views and engagement
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 */

/**
 * @swagger
 * /places/public/hot-weekly:
 *   get:
 *     summary: Get hot places this week
 *     description: Get places with high activity this week
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 */

/**
 * @swagger
 * /places/public/verified:
 *   get:
 *     summary: Get verified places
 *     description: Get all verified places
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 */

/**
 * @swagger
 * /places/public/category/{categoryId}:
 *   get:
 *     summary: Get places by category
 *     description: Get all places in a specific category
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 * /places/public/category/{categoryId}/hot:
 *   get:
 *     summary: Get hot places by category
 *     description: Get trending places in a specific category
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /places/user:
 *   post:
 *     summary: Create a new place
 *     description: Create a new place (authenticated users only)
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - address
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               address:
 *                 type: string
 *                 maxLength: 500
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *                 format: uri
 *               openingHours:
 *                 type: object
 *               categoryId:
 *                 type: string
 *             example:
 *               name: "Coffee House"
 *               description: "A cozy coffee shop with great atmosphere"
 *               address: "123 Main St, District 1, HCMC"
 *               latitude: 10.762622
 *               longitude: 106.660172
 *               phone: "+84123456789"
 *               website: "https://coffeehouse.com"
 *               openingHours: {}
 *               categoryId: "5ebac534954b54139806c114"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Get user places
 *     description: Get places created by the authenticated user
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /places/user/my-places:
 *   get:
 *     summary: Get my places
 *     description: Get all places created by the authenticated user
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /places/user/{placeId}:
 *   get:
 *     summary: Get user place by ID
 *     description: Get details of a specific place created by the authenticated user
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
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
 *               $ref: '#/components/schemas/Place'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a place
 *     description: Update a place created by the authenticated user
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               address:
 *                 type: string
 *                 maxLength: 500
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *                 format: uri
 *               openingHours:
 *                 type: object
 *               categoryId:
 *                 type: string
 *             example:
 *               name: "Updated Coffee House"
 *               description: "An updated description"
 *               address: "456 New St, District 1, HCMC"
 *               latitude: 10.762622
 *               longitude: 106.660172
 *               phone: "+84987654321"
 *               website: "https://updatedcoffeehouse.com"
 *               openingHours: {}
 *               categoryId: "5ebac534954b54139806c114"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
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
 *     summary: Delete a place
 *     description: Delete a place created by the authenticated user
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
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
 * /places/user/check-content:
 *   post:
 *     summary: Check place content
 *     description: Check if place content contains restricted words
 *     tags: [Places]
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
 *                 description: Content to check
 *             example:
 *               content: "This is a test content to check for restricted words"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasRestrictedWords:
 *                   type: boolean
 *                 filteredContent:
 *                   type: string
 *                 restrictedWords:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               hasRestrictedWords: false
 *               filteredContent: "This is a test content to check for restricted words"
 *               restrictedWords: []
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /places/admin:
 *   get:
 *     summary: Get all places (Admin)
 *     description: Get all places with admin privileges
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Filter by status
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /places/admin/pending:
 *   get:
 *     summary: Get pending places (Admin)
 *     description: Get all places pending approval
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of places
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /places/admin/{placeId}:
 *   get:
 *     summary: Get place by ID (Admin)
 *     description: Get details of any place with admin privileges
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
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
 *               $ref: '#/components/schemas/Place'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update any place (Admin)
 *     description: Update any place with admin privileges
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *               openingHours:
 *                 type: object
 *               categoryId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               isApproved:
 *                 type: boolean
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
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
 *     summary: Delete any place (Admin)
 *     description: Delete any place with admin privileges
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
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
 * /places/admin/{placeId}/approval-status:
 *   patch:
 *     summary: Update place approval status (Admin)
 *     description: Approve or reject a place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isApproved
 *             properties:
 *               isApproved:
 *                 type: boolean
 *                 description: Whether to approve the place
 *               reason:
 *                 type: string
 *                 description: Reason for rejection (if not approved)
 *             example:
 *               isApproved: true
 *               reason: "Place meets all requirements"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /places/admin/{placeId}/rating:
 *   patch:
 *     summary: Update place rating (Admin)
 *     description: Manually update place rating and statistics
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               totalReviews:
 *                 type: integer
 *                 minimum: 0
 *               totalRatings:
 *                 type: integer
 *                 minimum: 0
 *             example:
 *               rating: 4.5
 *               totalReviews: 25
 *               totalRatings: 30
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       "400":
 *         $ref: '#/components/responses/ValidationError'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */ 
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { placeValidation } = require('../../validations');
const { placeController } = require('../../controllers');

const router = express.Router();

// ========================================
// PUBLIC ROUTES (No authentication required)
// ========================================
// Client can only see approved and active places
router
  .route('/public')
  .get(validate(placeValidation.getPublicPlaces), placeController.getPublicPlaces);

router
  .route('/public/:placeId')
  .get(validate(placeValidation.getPublicPlace), placeController.getPublicPlace);

router
  .route('/public/search')
  .get(validate(placeValidation.searchPlaces), placeController.searchPlaces);

router
  .route('/public/trending')
  .get(validate(placeValidation.getTrendingPlaces), placeController.getTrendingPlaces);

router
  .route('/public/hot-weekly')
  .get(validate(placeValidation.getHotPlacesWeekly), placeController.getHotPlacesWeekly);

router
  .route('/public/verified')
  .get(validate(placeValidation.getVerifiedPlaces), placeController.getVerifiedPlaces);

router
  .route('/public/category/:categoryId')
  .get(validate(placeValidation.getPlacesByCategory), placeController.getPlacesByCategory);

router
  .route('/public/category/:categoryId/hot')
  .get(validate(placeValidation.getHotPlacesByCategory), placeController.getHotPlacesByCategory);

// ========================================
// USER ROUTES (Authenticated users)
// ========================================
// Users can only see and manage their own places
router
  .route('/user')
  .post(auth(), validate(placeValidation.createPlace), placeController.createPlace)
  .get(auth(), validate(placeValidation.getUserPlaces), placeController.getUserPlaces);

router
  .route('/user/my-places')
  .get(auth(), validate(placeValidation.getMyPlaces), placeController.getMyPlaces);

router
  .route('/user/:placeId')
  .get(auth(), validate(placeValidation.getUserPlace), placeController.getUserPlace)
  .patch(auth('manageOwnPlaces'), validate(placeValidation.updatePlace), placeController.updatePlace)
  .delete(auth('manageOwnPlaces'), validate(placeValidation.deletePlace), placeController.deletePlace);

// Content checking (available for users)
router
  .route('/user/check-content')
  .post(validate(placeValidation.checkPlaceContent), placeController.checkPlaceContent);

// ========================================
// ADMIN ROUTES (Admin/Moderator only)
// ========================================
// Admin can see and manage all places
router
  .route('/admin')
  .get(auth('managePlaces'), validate(placeValidation.getAdminPlaces), placeController.getAdminPlaces);

router
  .route('/admin/pending')
  .get(auth('approvePlaces'), validate(placeValidation.getPendingPlaces), placeController.getPendingPlaces);

router
  .route('/admin/:placeId')
  .get(auth('managePlaces'), validate(placeValidation.getAdminPlace), placeController.getAdminPlace)
  .patch(auth('managePlaces'), validate(placeValidation.updatePlace), placeController.updatePlace)
  .delete(auth('managePlaces'), validate(placeValidation.deletePlace), placeController.deletePlace);

router
  .route('/admin/:placeId/approval-status')
  .patch(auth('approvePlaces'), validate(placeValidation.updatePlaceApprovalStatus), placeController.updatePlaceApprovalStatus);

router
  .route('/admin/:placeId/rating')
  .patch(auth('managePlaces'), validate(placeValidation.updatePlaceRating), placeController.updatePlaceRating);

module.exports = router; 
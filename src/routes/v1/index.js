const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');
const docsRoute = require('./docs.route');
const categoryRoute = require('./category.route');
const uploadRoute = require('./upload.route');
const restrictedWordRoute = require('./restrictedWord.route');
const addressRoute = require('./address.route');
const ratingRoute = require('./rating.route');
const placeRoute = require('./place.route');
const reviewRoute = require('./review.route');
const commentRoute = require('./comment.route');
const reactionRoute = require('./reaction.route');
const reportRoute = require('./report.route');
const wardRoute = require('./ward.route');
const districtRoute = require('./district.route');
const moderatorRequestRoute = require('./moderatorRequest.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/profile',
    route: profileRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/restricted-words',
    route: restrictedWordRoute,
  },
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/rating',
    route: ratingRoute,
  },
  {
    path: '/places',
    route: placeRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/reactions',
    route: reactionRoute,
  },
  {
    path: '/reports',
    route: reportRoute,
  },
  {
    path: '/wards',
    route: wardRoute,
  },
  {
    path: '/districts',
    route: districtRoute,
  },
  {
    path: '/moderator-requests',
    route: moderatorRequestRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');
const docsRoute = require('./docs.route');
const categoryRoute = require('./category.route');
const uploadRoute = require('./upload.route');
const restrictedWordRoute = require('./restrictedWord.route');
const addressRoute = require('./address.route');
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

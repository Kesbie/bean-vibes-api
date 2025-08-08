const passport = require('passport');
const { UNAUTHORIZED, FORBIDDEN } = require('../utils/error.response');
const { roleRights } = require('../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new UNAUTHORIZED('Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new FORBIDDEN('Thằng chó! Mày không có quyền!'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

// Optional authentication middleware - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  return new Promise((resolve) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || info || !user) {
        // No user found, but continue without authentication
        req.user = null;
        return resolve();
      }
      req.user = user;
      resolve();
    })(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = { auth, optionalAuth };

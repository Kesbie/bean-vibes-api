const { BAD_REQUEST } = require('../utils/error.response');
const path = require('path');

const fileFilter = (req, res, next) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|webm/;
  const extname = allowedTypes.test(path.extname(res.originalname).toLowerCase());
  const mimetype = allowedTypes.test(res.mimetype);

  if (mimetype && extname) {
    return next();
  } else {
    return next(new BAD_REQUEST('Invalid file type. Only images and videos are allowed.'));
  }
};

module.exports = { fileFilter };

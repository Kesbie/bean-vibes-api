const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { restrictedWordValidation } = require('../../validations');
const { restrictedWordController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageRestrictedWords'),
    validate(restrictedWordValidation.createRestrictedWord),
    restrictedWordController.createRestrictedWord,
  )
  .get(
    auth('manageRestrictedWords'),
    validate(restrictedWordValidation.queryRestrictedWords),
    restrictedWordController.getRestrictedWords,
  )

router
  .route('/:restrictedWordId')
  .delete(
    auth('manageRestrictedWords'),
    validate(restrictedWordValidation.deleteRestrictedWord),
    restrictedWordController.deleteRestrictedWord,
  );

module.exports = router;

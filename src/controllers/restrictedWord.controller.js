const catchAsync = require('../utils/catchAsync');
const { restrictedWordService } = require('../services');
const { OK, CREATED, NO_CONTENT } = require('../utils/success.response');
const pick = require('../utils/pick');

const createRestrictedWord = catchAsync(async (req, res) => {
  const restrictedWord = await restrictedWordService.createRestrictedWord(req.body);
  new CREATED(restrictedWord).send(res);
});

const getRestrictedWords = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['word', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const restrictedWords = await restrictedWordService.queryRestrictedWords(filter, options);
  new OK(restrictedWords).send(res);
});

const deleteRestrictedWord = catchAsync(async (req, res) => {
  const restrictedWord = await restrictedWordService.deleteRestrictedWord(req.params.restrictedWordId);
  new NO_CONTENT(restrictedWord).send(res);
});

const updateRestrictedWord = catchAsync(async (req, res) => {
  const restrictedWord = await restrictedWordService.updateRestrictedWord(req.params.restrictedWordId, req.body);
  new OK(restrictedWord).send(res);
});

module.exports = {
  createRestrictedWord,
  getRestrictedWords,
  deleteRestrictedWord,
  updateRestrictedWord,
};
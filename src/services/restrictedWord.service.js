const { RestrictedWord } = require('../models');
const { BAD_REQUEST } = require('../utils/error.response');

const createRestrictedWord = async (restrictedWordBody) => {
  const isWordExists = await RestrictedWord.isWordExists(restrictedWordBody.word);
  
  if (isWordExists) {
    throw new BAD_REQUEST('Word already exists');
  }
  const restrictedWord = await RestrictedWord.create(restrictedWordBody);
  return restrictedWord;
};

const queryRestrictedWords = async (filter, options) => {
  const restrictedWords = await RestrictedWord.paginate(filter, options);
  return restrictedWords;
};

const deleteRestrictedWord = async (restrictedWordId) => {
  const restrictedWord = await RestrictedWord.findById(restrictedWordId);
  if (!restrictedWord) {
    throw new NOT_FOUND('Restricted word not found');
  }
  await restrictedWord.deleteOne();
  return restrictedWord;
};

const updateRestrictedWord = async (restrictedWordId, restrictedWordBody) => {
  const restrictedWord = await RestrictedWord.findById(restrictedWordId);
  if (!restrictedWord) {
    throw new NOT_FOUND('Restricted word not found');
  }
  Object.assign(restrictedWord, restrictedWordBody);
  await restrictedWord.save();
  return restrictedWord;
};

module.exports = {
  createRestrictedWord,
  queryRestrictedWords,
  deleteRestrictedWord,
  updateRestrictedWord,
};
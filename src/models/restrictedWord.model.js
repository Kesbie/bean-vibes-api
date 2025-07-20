const mongoose = require('mongoose');
const { RESTRICTED_WORD_TYPES } = require('../constants/restrictedWordTypes');
const { toJSON, paginate } = require('./plugins');
const { normalizeVietnamese } = require('../utils/nomalizeText');
const { replacementWord } = require('../utils/replacementWord');

const restrictedWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  normalizedWord: {
    type: String,
  },
  replacement: {
    type: String,
  },
  type: {
    type: String,
    enum: Object.values(RESTRICTED_WORD_TYPES),
    required: true,
  },
}, {
  timestamps: true,
});

restrictedWordSchema.statics.isWordExists = async function (word) {
  return this.exists({ normalizedWord: normalizeVietnamese(word) });
};

restrictedWordSchema.pre('save', async function (next) {
  this.normalizedWord = normalizeVietnamese(this.word);

  if (!this.replacement) {
    this.replacement = replacementWord(this.word);
  }

  next();
});

restrictedWordSchema.plugin(toJSON);
restrictedWordSchema.plugin(paginate);

module.exports = mongoose.model('RestrictedWord', restrictedWordSchema);
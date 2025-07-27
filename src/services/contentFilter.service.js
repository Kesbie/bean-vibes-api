const { RestrictedWord } = require('../models');
const { normalizeVietnamese } = require('../utils/nomalizeText');
const { RESTRICTED_WORD_TYPES } = require('../constants/restrictedWordTypes');
const ApiError = require('../utils/error.response');
const httpStatus = require('http-status');

/**
 * Check if content contains restricted words
 * @param {string} content - Content to check
 * @returns {Promise<Object>} - Result with found words and their types
 */
const checkRestrictedContent = async (content) => {
  if (!content) {
    return { hasRestrictedWords: false, foundWords: [] };
  }

  const normalizedContent = normalizeVietnamese(content.toLowerCase());
  const restrictedWords = await RestrictedWord.find({});
  
  const foundWords = [];
  let hasBannedWords = false;

  for (const word of restrictedWords) {
    if (normalizedContent.includes(word.normalizedWord)) {
      foundWords.push({
        word: word.word,
        type: word.type,
        replacement: word.replacement,
      });
      
      if (word.type === RESTRICTED_WORD_TYPES.BAN) {
        hasBannedWords = true;
      }
    }
  }

  return {
    hasRestrictedWords: foundWords.length > 0,
    hasBannedWords,
    foundWords,
  };
};

/**
 * Check place content for restricted words
 * @param {Object} placeData - Place data to check
 * @returns {Promise<Object>} - Result with found words and their types
 */
const checkPlaceContent = async (placeData) => {
  // Extract address fields for content checking
  const addressFields = [];
  if (placeData.address) {
    if (typeof placeData.address === 'string') {
      // Handle legacy address format
      addressFields.push(placeData.address);
    } else {
      // Handle new address object format
      if (placeData.address.street) addressFields.push(placeData.address.street);
      if (placeData.address.ward) addressFields.push(placeData.address.ward);
      if (placeData.address.district) addressFields.push(placeData.address.district);
      if (placeData.address.fullAddress) addressFields.push(placeData.address.fullAddress);
    }
  }

  const contentToCheck = [
    placeData.name,
    placeData.description,
    ...addressFields,
  ].filter(Boolean).join(' ');

  return checkRestrictedContent(contentToCheck);
};

/**
 * Validate place content and throw error if banned words found
 * @param {Object} placeData - Place data to validate
 * @throws {ApiError} - If banned words are found
 */
const validatePlaceContent = async (placeData) => {
  const result = await checkPlaceContent(placeData);
  
  if (result.hasBannedWords) {
    const bannedWords = result.foundWords
      .filter(word => word.type === RESTRICTED_WORD_TYPES.BAN)
      .map(word => word.word);
    
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Content contains banned words: ${bannedWords.join(', ')}`
    );
  }
  
  return result;
};

/**
 * Replace restricted words in content
 * @param {string} content - Content to process
 * @returns {Promise<string>} - Processed content
 */
const replaceRestrictedWords = async (content) => {
  if (!content) {
    return content;
  }

  const normalizedContent = normalizeVietnamese(content.toLowerCase());
  const restrictedWords = await RestrictedWord.find({
    type: { $in: [RESTRICTED_WORD_TYPES.WARN, RESTRICTED_WORD_TYPES.HIDE] }
  });
  
  let processedContent = content;

  for (const word of restrictedWords) {
    const regex = new RegExp(word.word, 'gi');
    processedContent = processedContent.replace(regex, word.replacement || '*'.repeat(word.word.length));
  }

  return processedContent;
};

module.exports = {
  checkRestrictedContent,
  checkPlaceContent,
  validatePlaceContent,
  replaceRestrictedWords,
}; 
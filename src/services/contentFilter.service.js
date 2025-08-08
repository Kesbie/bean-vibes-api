const { RestrictedWord } = require('../models');
const { normalizeVietnamese } = require('../utils/nomalizeText');
const { RESTRICTED_WORD_TYPES } = require('../constants/restrictedWordTypes');
const { BAD_REQUEST } = require('../utils/error.response');

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

  // Split content into words and clean them
  const contentWords = normalizedContent
    .split(/\s+/)
    .map(word => word.replace(/[^\w\s]/g, '')) // Remove punctuation
    .filter(word => word.length > 0); // Remove empty strings

  for (const word of restrictedWords) {
    // Check if the restricted word exists as a complete word in content
    if (contentWords.includes(word.normalizedWord)) {
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
  const contentToCheck = [
    placeData.name,
    placeData.description,
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
    
    throw new BAD_REQUEST(
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

  const restrictedWords = await RestrictedWord.find({
    type: { $in: [RESTRICTED_WORD_TYPES.WARN, RESTRICTED_WORD_TYPES.HIDE] }
  });
  
  let processedContent = content;

  for (const word of restrictedWords) {
    // Use word boundary regex to match complete words only
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
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
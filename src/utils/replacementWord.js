const replacementWord = (word) => {
  return `${word[0]}${Array(word.length - 1).fill('*').join('')}`;
};

module.exports = { replacementWord };
const replacementWord = (word) => {
  const chars = word.split('');
  const firstChar = chars[0];
  const rest = chars.slice(1).map(char => char === ' ' ? ' ' : '*').join('');
  return firstChar + rest;
};

module.exports = { replacementWord };
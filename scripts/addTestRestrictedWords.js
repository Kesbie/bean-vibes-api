const mongoose = require('mongoose');
const config = require('../src/config/config');
const { RestrictedWord } = require('../src/models');
const { normalizeVietnamese } = require('../src/utils/nomalizeText');
const { RESTRICTED_WORD_TYPES } = require('../src/constants/restrictedWordTypes');

/**
 * Add test restricted words for content filter testing
 */
async function addTestRestrictedWords() {
  try {
    console.log('📝 Adding test restricted words...');
    
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    // Test words to add
    const testWords = [
      {
        word: 'duc',
        type: RESTRICTED_WORD_TYPES.BAN,
        replacement: '***',
        normalizedWord: normalizeVietnamese('duc')
      },
      {
        word: 'du',
        type: RESTRICTED_WORD_TYPES.WARN,
        replacement: '**',
        normalizedWord: normalizeVietnamese('du')
      },
      {
        word: 'test',
        type: RESTRICTED_WORD_TYPES.HIDE,
        replacement: '****',
        normalizedWord: normalizeVietnamese('test')
      }
    ];
    
    console.log('\n📋 Test words to add:');
    testWords.forEach(word => {
      console.log(`- ${word.word} (${word.type}) -> ${word.replacement}`);
    });
    
    // Check if words already exist
    const existingWords = await RestrictedWord.find({
      word: { $in: testWords.map(w => w.word) }
    });
    
    if (existingWords.length > 0) {
      console.log('\n⚠️  Some words already exist:');
      existingWords.forEach(word => {
        console.log(`- ${word.word} (${word.type})`);
      });
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        rl.question('\nDo you want to continue and add missing words? (yes/no): ', resolve);
      });
      
      rl.close();
      
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled');
        return;
      }
    }
    
    // Add words that don't exist
    const wordsToAdd = testWords.filter(testWord => 
      !existingWords.some(existing => existing.word === testWord.word)
    );
    
    if (wordsToAdd.length === 0) {
      console.log('ℹ️  All test words already exist');
      return;
    }
    
    console.log(`\n➕ Adding ${wordsToAdd.length} new words...`);
    
    const results = await RestrictedWord.insertMany(wordsToAdd);
    
    console.log('✅ Successfully added test words:');
    results.forEach(word => {
      console.log(`- ${word.word} (${word.type})`);
    });
    
    // Show all restricted words
    const allWords = await RestrictedWord.find({}).sort('word');
    console.log(`\n📋 Total restricted words: ${allWords.length}`);
    
  } catch (error) {
    console.error('❌ Error adding test words:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

/**
 * Remove test restricted words
 */
async function removeTestRestrictedWords() {
  try {
    console.log('🗑️  Removing test restricted words...');
    
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    const testWords = ['duc', 'du', 'test'];
    
    const result = await RestrictedWord.deleteMany({
      word: { $in: testWords }
    });
    
    console.log(`✅ Removed ${result.deletedCount} test words`);
    
  } catch (error) {
    console.error('❌ Error removing test words:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📝 Test Restricted Words Script

Usage:
  node scripts/addTestRestrictedWords.js              # Add test words
  node scripts/addTestRestrictedWords.js --remove     # Remove test words
  node scripts/addTestRestrictedWords.js --help       # Show this help

Examples:
  # Add test restricted words
  node scripts/addTestRestrictedWords.js
  
  # Remove test restricted words
  node scripts/addTestRestrictedWords.js --remove
  
  # Show help
  node scripts/addTestRestrictedWords.js --help

Test words:
  - duc (BAN) - for testing exact word matching
  - du (WARN) - for testing substring vs exact word
  - test (HIDE) - for testing replacement
  `);
  process.exit(0);
}

// Run appropriate function
if (args.includes('--remove')) {
  removeTestRestrictedWords();
} else {
  addTestRestrictedWords();
} 
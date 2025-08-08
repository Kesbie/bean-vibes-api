require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./src/config/config');
const { checkRestrictedContent, replaceRestrictedWords } = require('./src/services/contentFilter.service');
const { RestrictedWord } = require('./src/models');

/**
 * Test content filter with various scenarios
 */
async function testContentFilter() {
  try {
    console.log('🧪 Testing Content Filter Logic...');
    
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    // Test cases
    const testCases = [
      {
        name: 'Test 1: Exact word match',
        content: 'This is a test with duc word',
        expectedMatch: true,
        description: 'Should match "duc" as a complete word'
      },
      {
        name: 'Test 2: Substring should not match',
        content: 'This is a test with education word',
        expectedMatch: false,
        description: 'Should NOT match "du" inside "education"'
      },
      {
        name: 'Test 3: Word with punctuation',
        content: 'This is duc! and duc.',
        expectedMatch: true,
        description: 'Should match "duc" even with punctuation'
      },
      {
        name: 'Test 4: Multiple occurrences',
        content: 'duc duc duc duc',
        expectedMatch: true,
        description: 'Should match all occurrences of "duc"'
      },
      {
        name: 'Test 5: Case insensitive',
        content: 'This is DUC and DuC',
        expectedMatch: true,
        description: 'Should match regardless of case'
      },
      {
        name: 'Test 6: No match',
        content: 'This is a normal sentence without restricted words',
        expectedMatch: false,
        description: 'Should not match anything'
      },
      {
        name: 'Test 7: Word boundaries',
        content: 'This is education and duc separately',
        expectedMatch: true,
        description: 'Should match "duc" but not "du" in "education"'
      }
    ];
    
    console.log('\n📋 Running test cases...\n');
    
    for (const testCase of testCases) {
      console.log(`🧪 ${testCase.name}`);
      console.log(`Content: "${testCase.content}"`);
      console.log(`Expected: ${testCase.expectedMatch ? 'Match' : 'No match'}`);
      console.log(`Description: ${testCase.description}`);
      
      const result = await checkRestrictedContent(testCase.content);
      const hasMatch = result.hasRestrictedWords;
      
      console.log(`Result: ${hasMatch ? 'Match' : 'No match'}`);
      if (hasMatch) {
        console.log(`Found words: ${result.foundWords.map(w => w.word).join(', ')}`);
      }
      
      const passed = hasMatch === testCase.expectedMatch;
      console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log('---\n');
    }
    
    // Test replacement function
    console.log('🔄 Testing word replacement...');
    const replacementTest = 'This is duc and education with duc!';
    console.log(`Original: "${replacementTest}"`);
    
    const replaced = await replaceRestrictedWords(replacementTest);
    console.log(`Replaced: "${replaced}"`);
    
    console.log('\n🎉 Content filter testing completed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

/**
 * Show current restricted words in database
 */
async function showRestrictedWords() {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    const words = await RestrictedWord.find({}).sort('word');
    
    console.log('\n📋 Current Restricted Words:');
    console.log('Word\t\tType\t\tNormalized');
    console.log('----\t\t----\t\t----------');
    
    words.forEach(word => {
      console.log(`${word.word}\t\t${word.type}\t\t${word.normalizedWord}`);
    });
    
    console.log(`\nTotal: ${words.length} words`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🧪 Content Filter Test Script

Usage:
  node test-content-filter.js                    # Run all tests
  node test-content-filter.js --words           # Show restricted words
  node test-content-filter.js --help            # Show this help

Examples:
  # Run content filter tests
  node test-content-filter.js
  
  # Show current restricted words
  node test-content-filter.js --words
  
  # Show help
  node test-content-filter.js --help
  `);
  process.exit(0);
}

// Run appropriate function
if (args.includes('--words')) {
  showRestrictedWords();
} else {
  testContentFilter();
} 
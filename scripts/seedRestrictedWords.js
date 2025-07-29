#!/usr/bin/env node

const path = require('path');
const mongoose = require('mongoose');
const config = require('../src/config/config');
const { RestrictedWord } = require('../src/models');
const { RESTRICTED_WORD_TYPES } = require('../src/constants/restrictedWordTypes');

const sampleRestrictedWords = [
  // Banned words - không cho phép tạo place
  { word: 'địt', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'đụ', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'lồn', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'cặc', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'đcm', type: RESTRICTED_WORD_TYPES.BAN },
  { word: 'đcm', type: RESTRICTED_WORD_TYPES.BAN },
  
  // Warning words - thay thế bằng dấu *
  { word: 'đéo', type: RESTRICTED_WORD_TYPES.WARN },
  { word: 'đm', type: RESTRICTED_WORD_TYPES.WARN },
  { word: 'clm', type: RESTRICTED_WORD_TYPES.WARN },
  { word: 'cl', type: RESTRICTED_WORD_TYPES.WARN },
  
  // Hide words - ẩn hoàn toàn
  { word: 'sex', type: RESTRICTED_WORD_TYPES.HIDE },
  { word: 'porn', type: RESTRICTED_WORD_TYPES.HIDE },
  { word: 'xxx', type: RESTRICTED_WORD_TYPES.HIDE },
];

async function seedRestrictedWords() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('Connected to MongoDB');

    // Clear existing restricted words
    await RestrictedWord.deleteMany({});
    console.log('Cleared existing restricted words');

    // Insert sample restricted words
    const insertedWords = await RestrictedWord.insertMany(sampleRestrictedWords);
    console.log(`Inserted ${insertedWords.length} restricted words`);

    // Display inserted words
    console.log('\nInserted restricted words:');
    insertedWords.forEach(word => {
      console.log(`- ${word.word} (${word.type})`);
    });

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Error seeding restricted words:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedRestrictedWords(); 
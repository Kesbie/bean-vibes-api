const mongoose = require('mongoose');
const config = require('../src/config/config');
const Place = require('../src/models/places.model');
const Rating = require('../src/models/rating.model');
const Review = require('../src/models/reviews.model');
const Comment = require('../src/models/comment.model');
const Reaction = require('../src/models/reaction.model');
const Report = require('../src/models/report.model');

/**
 * Delete all places and related data
 */
async function deleteAllPlaces() {
  try {
    console.log('🗑️  Starting deletion of all places...');
    
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    // Get count before deletion
    const placeCount = await Place.countDocuments();
    const ratingCount = await Rating.countDocuments();
    const reviewCount = await Review.countDocuments();
    const commentCount = await Comment.countDocuments();
    const reactionCount = await Reaction.countDocuments();
    const reportCount = await Report.countDocuments();
    
    console.log('\n📊 Current data counts:');
    console.log(`- Places: ${placeCount}`);
    console.log(`- Ratings: ${ratingCount}`);
    console.log(`- Reviews: ${reviewCount}`);
    console.log(`- Comments: ${commentCount}`);
    console.log(`- Reactions: ${reactionCount}`);
    console.log(`- Reports: ${reportCount}`);
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('\n⚠️  WARNING: This will delete ALL places and related data!\nAre you sure you want to continue? (yes/no): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      process.exit(0);
    }
    
    console.log('\n🗑️  Starting deletion process...');
    
    // Delete related data first (due to foreign key constraints)
    console.log('1. Deleting ratings...');
    const ratingResult = await Rating.deleteMany({});
    console.log(`   ✅ Deleted ${ratingResult.deletedCount} ratings`);
    
    console.log('2. Deleting reactions...');
    const reactionResult = await Reaction.deleteMany({});
    console.log(`   ✅ Deleted ${reactionResult.deletedCount} reactions`);
    
    console.log('3. Deleting comments...');
    const commentResult = await Comment.deleteMany({});
    console.log(`   ✅ Deleted ${commentResult.deletedCount} comments`);
    
    console.log('4. Deleting reports...');
    const reportResult = await Report.deleteMany({});
    console.log(`   ✅ Deleted ${reportResult.deletedCount} reports`);
    
    console.log('5. Deleting reviews...');
    const reviewResult = await Review.deleteMany({});
    console.log(`   ✅ Deleted ${reviewResult.deletedCount} reviews`);
    
    console.log('6. Deleting places...');
    const placeResult = await Place.deleteMany({});
    console.log(`   ✅ Deleted ${placeResult.deletedCount} places`);
    
    // Verify deletion
    const remainingPlaces = await Place.countDocuments();
    const remainingRatings = await Rating.countDocuments();
    const remainingReviews = await Review.countDocuments();
    const remainingComments = await Comment.countDocuments();
    const remainingReactions = await Reaction.countDocuments();
    const remainingReports = await Report.countDocuments();
    
    console.log('\n✅ Deletion completed successfully!');
    console.log('\n📊 Remaining data counts:');
    console.log(`- Places: ${remainingPlaces}`);
    console.log(`- Ratings: ${remainingRatings}`);
    console.log(`- Reviews: ${remainingReviews}`);
    console.log(`- Comments: ${remainingComments}`);
    console.log(`- Reactions: ${remainingReactions}`);
    console.log(`- Reports: ${remainingReports}`);
    
    console.log('\n🎉 All places and related data have been deleted!');
    
  } catch (error) {
    console.error('❌ Error during deletion:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
}

/**
 * Delete places with specific filters
 */
async function deletePlacesWithFilter(filter = {}) {
  try {
    console.log('🗑️  Starting deletion of places with filter...');
    console.log('Filter:', JSON.stringify(filter, null, 2));
    
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    // Get count before deletion
    const placeCount = await Place.countDocuments(filter);
    console.log(`📊 Found ${placeCount} places matching the filter`);
    
    if (placeCount === 0) {
      console.log('ℹ️  No places found matching the filter');
      return;
    }
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question(`\n⚠️  WARNING: This will delete ${placeCount} places!\nAre you sure you want to continue? (yes/no): `, resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      process.exit(0);
    }
    
    // Get place IDs first
    const places = await Place.find(filter).select('_id');
    const placeIds = places.map(place => place._id);
    
    console.log('\n🗑️  Starting deletion process...');
    
    // Delete related data for these places
    console.log('1. Deleting ratings for these places...');
    const ratingResult = await Rating.deleteMany({ place: { $in: placeIds } });
    console.log(`   ✅ Deleted ${ratingResult.deletedCount} ratings`);
    
    console.log('2. Deleting reactions for these places...');
    const reactionResult = await Reaction.deleteMany({ place: { $in: placeIds } });
    console.log(`   ✅ Deleted ${reactionResult.deletedCount} reactions`);
    
    console.log('3. Deleting comments for these places...');
    const commentResult = await Comment.deleteMany({ place: { $in: placeIds } });
    console.log(`   ✅ Deleted ${commentResult.deletedCount} comments`);
    
    console.log('4. Deleting reports for these places...');
    const reportResult = await Report.deleteMany({ place: { $in: placeIds } });
    console.log(`   ✅ Deleted ${reportResult.deletedCount} reports`);
    
    console.log('5. Deleting reviews for these places...');
    const reviewResult = await Review.deleteMany({ place: { $in: placeIds } });
    console.log(`   ✅ Deleted ${reviewResult.deletedCount} reviews`);
    
    console.log('6. Deleting places...');
    const placeResult = await Place.deleteMany(filter);
    console.log(`   ✅ Deleted ${placeResult.deletedCount} places`);
    
    console.log('\n✅ Deletion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during deletion:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🗑️  Delete All Places Script

Usage:
  node scripts/deleteAllPlaces.js                    # Delete all places
  node scripts/deleteAllPlaces.js --filter           # Delete places with filter
  node scripts/deleteAllPlaces.js --help             # Show this help

Examples:
  # Delete all places
  node scripts/deleteAllPlaces.js
  
  # Delete places with filter (modify the filter in the script)
  node scripts/deleteAllPlaces.js --filter
  
  # Show help
  node scripts/deleteAllPlaces.js --help

⚠️  WARNING: This script will permanently delete data from the database!
  `);
  process.exit(0);
}

// Run the appropriate function
if (args.includes('--filter')) {
  // Example filter - modify as needed
  const filter = {
    // approvalStatus: 'pending',
    // isVerified: false,
    // createdBy: 'specific-user-id'
  };
  deletePlacesWithFilter(filter);
} else {
  deleteAllPlaces();
} 
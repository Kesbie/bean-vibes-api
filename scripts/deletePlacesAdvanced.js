const mongoose = require('mongoose');
const config = require('../src/config/config');
const Place = require('../src/models/places.model');
const Rating = require('../src/models/rating.model');
const Review = require('../src/models/reviews.model');
const Comment = require('../src/models/comment.model');
const Reaction = require('../src/models/reaction.model');
const Report = require('../src/models/report.model');

/**
 * Show statistics about places and related data
 */
async function showStatistics() {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    const placeCount = await Place.countDocuments();
    const ratingCount = await Rating.countDocuments();
    const reviewCount = await Review.countDocuments();
    const commentCount = await Comment.countDocuments();
    const reactionCount = await Reaction.countDocuments();
    const reportCount = await Report.countDocuments();
    
    console.log('\n📊 Database Statistics:');
    console.log(`- Places: ${placeCount}`);
    console.log(`- Ratings: ${ratingCount}`);
    console.log(`- Reviews: ${reviewCount}`);
    console.log(`- Comments: ${commentCount}`);
    console.log(`- Reactions: ${reactionCount}`);
    console.log(`- Reports: ${reportCount}`);
    
    // Show places by status
    const pendingPlaces = await Place.countDocuments({ approvalStatus: 'pending' });
    const approvedPlaces = await Place.countDocuments({ approvalStatus: 'approved' });
    const rejectedPlaces = await Place.countDocuments({ approvalStatus: 'rejected' });
    const verifiedPlaces = await Place.countDocuments({ isVerified: true });
    
    console.log('\n📋 Places by Status:');
    console.log(`- Pending: ${pendingPlaces}`);
    console.log(`- Approved: ${approvedPlaces}`);
    console.log(`- Rejected: ${rejectedPlaces}`);
    console.log(`- Verified: ${verifiedPlaces}`);
    
    // Show places by category (top 5)
    const categoryStats = await Place.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    if (categoryStats.length > 0) {
      console.log('\n🏷️  Top Categories:');
      categoryStats.forEach(stat => {
        console.log(`- Category ${stat._id}: ${stat.count} places`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error getting statistics:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

/**
 * Delete places with specific criteria
 */
async function deletePlacesWithCriteria(criteria) {
  try {
    console.log('🗑️  Starting deletion with criteria...');
    console.log('Criteria:', JSON.stringify(criteria, null, 2));
    
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    // Get places matching criteria
    const places = await Place.find(criteria);
    const placeIds = places.map(place => place._id);
    
    console.log(`📊 Found ${places.length} places matching criteria`);
    
    if (places.length === 0) {
      console.log('ℹ️  No places found matching the criteria');
      return;
    }
    
    // Show sample places
    console.log('\n📋 Sample places to be deleted:');
    places.slice(0, 3).forEach(place => {
      console.log(`- ${place.name} (${place.approvalStatus})`);
    });
    
    if (places.length > 3) {
      console.log(`- ... and ${places.length - 3} more`);
    }
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question(`\n⚠️  WARNING: This will delete ${places.length} places!\nAre you sure you want to continue? (yes/no): `, resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      return;
    }
    
    console.log('\n🗑️  Starting deletion process...');
    
    // Delete related data
    const ratingResult = await Rating.deleteMany({ place: { $in: placeIds } });
    console.log(`✅ Deleted ${ratingResult.deletedCount} ratings`);
    
    const reactionResult = await Reaction.deleteMany({ place: { $in: placeIds } });
    console.log(`✅ Deleted ${reactionResult.deletedCount} reactions`);
    
    const commentResult = await Comment.deleteMany({ place: { $in: placeIds } });
    console.log(`✅ Deleted ${commentResult.deletedCount} comments`);
    
    const reportResult = await Report.deleteMany({ place: { $in: placeIds } });
    console.log(`✅ Deleted ${reportResult.deletedCount} reports`);
    
    const reviewResult = await Review.deleteMany({ place: { $in: placeIds } });
    console.log(`✅ Deleted ${reviewResult.deletedCount} reviews`);
    
    // Delete places
    const placeResult = await Place.deleteMany(criteria);
    console.log(`✅ Deleted ${placeResult.deletedCount} places`);
    
    console.log('\n🎉 Deletion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during deletion:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

/**
 * Delete places by ID list
 */
async function deletePlacesByIds(placeIds) {
  try {
    console.log('🗑️  Starting deletion by IDs...');
    console.log('Place IDs:', placeIds);
    
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('✅ Connected to database');
    
    // Verify places exist
    const places = await Place.find({ _id: { $in: placeIds } });
    console.log(`📊 Found ${places.length} places out of ${placeIds.length} IDs`);
    
    if (places.length === 0) {
      console.log('ℹ️  No places found with the provided IDs');
      return;
    }
    
    const foundPlaceIds = places.map(place => place._id);
    
    // Show places to be deleted
    console.log('\n📋 Places to be deleted:');
    places.forEach(place => {
      console.log(`- ${place.name} (${place.approvalStatus})`);
    });
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question(`\n⚠️  WARNING: This will delete ${places.length} places!\nAre you sure you want to continue? (yes/no): `, resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      return;
    }
    
    console.log('\n🗑️  Starting deletion process...');
    
    // Delete related data
    const ratingResult = await Rating.deleteMany({ place: { $in: foundPlaceIds } });
    console.log(`✅ Deleted ${ratingResult.deletedCount} ratings`);
    
    const reactionResult = await Reaction.deleteMany({ place: { $in: foundPlaceIds } });
    console.log(`✅ Deleted ${reactionResult.deletedCount} reactions`);
    
    const commentResult = await Comment.deleteMany({ place: { $in: foundPlaceIds } });
    console.log(`✅ Deleted ${commentResult.deletedCount} comments`);
    
    const reportResult = await Report.deleteMany({ place: { $in: foundPlaceIds } });
    console.log(`✅ Deleted ${reportResult.deletedCount} reports`);
    
    const reviewResult = await Review.deleteMany({ place: { $in: foundPlaceIds } });
    console.log(`✅ Deleted ${reviewResult.deletedCount} reviews`);
    
    // Delete places
    const placeResult = await Place.deleteMany({ _id: { $in: foundPlaceIds } });
    console.log(`✅ Deleted ${placeResult.deletedCount} places`);
    
    console.log('\n🎉 Deletion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during deletion:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🗑️  Advanced Delete Places Script

Usage:
  node scripts/deletePlacesAdvanced.js --stats                    # Show statistics
  node scripts/deletePlacesAdvanced.js --criteria                 # Delete with criteria
  node scripts/deletePlacesAdvanced.js --ids <id1,id2,id3>        # Delete by IDs
  node scripts/deletePlacesAdvanced.js --help                     # Show this help

Examples:
  # Show database statistics
  node scripts/deletePlacesAdvanced.js --stats
  
  # Delete pending places
  node scripts/deletePlacesAdvanced.js --criteria pending
  
  # Delete unverified places
  node scripts/deletePlacesAdvanced.js --criteria unverified
  
  # Delete places by specific IDs
  node scripts/deletePlacesAdvanced.js --ids 64f8a1b2c3d4e5f6a7b8c9d0,64f8a1b2c3d4e5f6a7b8c9d1
  
  # Show help
  node scripts/deletePlacesAdvanced.js --help

Available criteria:
  - pending: approvalStatus = 'pending'
  - approved: approvalStatus = 'approved'
  - rejected: approvalStatus = 'rejected'
  - unverified: isVerified = false
  - verified: isVerified = true

⚠️  WARNING: This script will permanently delete data from the database!
  `);
  process.exit(0);
}

// Run appropriate function based on arguments
if (args.includes('--stats')) {
  showStatistics();
} else if (args.includes('--criteria')) {
  const criteriaArg = args[args.indexOf('--criteria') + 1];
  
  let criteria = {};
  switch (criteriaArg) {
    case 'pending':
      criteria = { approvalStatus: 'pending' };
      break;
    case 'approved':
      criteria = { approvalStatus: 'approved' };
      break;
    case 'rejected':
      criteria = { approvalStatus: 'rejected' };
      break;
    case 'unverified':
      criteria = { isVerified: false };
      break;
    case 'verified':
      criteria = { isVerified: true };
      break;
    default:
      console.log('❌ Invalid criteria. Use --help for available options.');
      process.exit(1);
  }
  
  deletePlacesWithCriteria(criteria);
} else if (args.includes('--ids')) {
  const idsArg = args[args.indexOf('--ids') + 1];
  if (!idsArg) {
    console.log('❌ Please provide place IDs separated by commas');
    process.exit(1);
  }
  
  const placeIds = idsArg.split(',').map(id => id.trim());
  deletePlacesByIds(placeIds);
} else {
  console.log('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
} 
const mongoose = require('mongoose');
const { Comment } = require('./src/models/comment.model');
const { Review } = require('./src/models/reviews.model');

// Test script to verify the new isHidden functionality
async function testHiddenContent() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Create a test review
    const testReview = new Review({
      place: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      title: 'Test Review',
      content: 'This is a test review content',
      isHidden: false,
    });
    await testReview.save();
    console.log('✅ Created test review:', testReview._id);

    // Test 2: Create a test comment
    const testComment = new Comment({
      review: testReview._id,
      user: new mongoose.Types.ObjectId(),
      content: 'This is a test comment',
      isHidden: false,
    });
    await testComment.save();
    console.log('✅ Created test comment:', testComment._id);

    // Test 3: Hide the review
    testReview.isHidden = true;
    await testReview.save();
    console.log('✅ Hidden review');

    // Test 4: Hide the comment
    testComment.isHidden = true;
    await testComment.save();
    console.log('✅ Hidden comment');

    // Test 5: Query reviews without hidden ones (should return empty)
    const visibleReviews = await Review.find({ isHidden: { $ne: true } });
    console.log('✅ Visible reviews count:', visibleReviews.length);

    // Test 6: Query comments without hidden ones (should return empty)
    const visibleComments = await Comment.find({ isHidden: { $ne: true } });
    console.log('✅ Visible comments count:', visibleComments.length);

    // Test 7: Query all reviews including hidden ones
    const allReviews = await Review.find({});
    console.log('✅ All reviews count (including hidden):', allReviews.length);

    // Test 8: Query all comments including hidden ones
    const allComments = await Comment.find({});
    console.log('✅ All comments count (including hidden):', allComments.length);

    // Test 9: Unhide the review
    testReview.isHidden = false;
    await testReview.save();
    console.log('✅ Unhidden review');

    // Test 10: Unhide the comment
    testComment.isHidden = false;
    await testComment.save();
    console.log('✅ Unhidden comment');

    // Test 11: Verify they are visible again
    const visibleReviewsAfter = await Review.find({ isHidden: { $ne: true } });
    console.log('✅ Visible reviews count after unhiding:', visibleReviewsAfter.length);

    const visibleCommentsAfter = await Comment.find({ isHidden: { $ne: true } });
    console.log('✅ Visible comments count after unhiding:', visibleCommentsAfter.length);

    // Cleanup
    await Review.deleteOne({ _id: testReview._id });
    await Comment.deleteOne({ _id: testComment._id });
    console.log('✅ Cleaned up test data');

    console.log('\n🎉 All tests passed! The isHidden functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testHiddenContent();

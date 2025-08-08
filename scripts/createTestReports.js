const mongoose = require('mongoose');
const { Report, Review, Comment, User } = require('../src/models');
const config = require('../src/config/config');

// Connect to MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options);

async function createTestReports() {
  try {
    console.log('Creating test reports...\n');

    // Find or create test users
    let testUser1 = await User.findOne({ email: 'testuser1@example.com' });
    if (!testUser1) {
      testUser1 = await User.create({
        name: 'Test User 1',
        email: 'testuser1@example.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Created test user 1:', testUser1.email);
    }

    let testUser2 = await User.findOne({ email: 'testuser2@example.com' });
    if (!testUser2) {
      testUser2 = await User.create({
        name: 'Test User 2',
        email: 'testuser2@example.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Created test user 2:', testUser2.email);
    }

    // Create test review
    const testReview = await Review.create({
      title: 'Test Review Title',
      content: 'This is a test review content that might be reported.',
      user: testUser1._id,
      place: new mongoose.Types.ObjectId(), // Dummy place ID
    });
    console.log('Created test review:', testReview.title);

    // Create test comment
    const testComment = await Comment.create({
      content: 'This is a test comment content that might be reported.',
      user: testUser2._id,
      review: testReview._id,
    });
    console.log('Created test comment:', testComment.content);

    // Create reports for the review
    const reviewReport1 = await Report.create({
      reportable: testReview._id,
      reportableModel: 'Review',
      user: testUser2._id,
      title: 'Inappropriate Review Content',
      reason: 'This review contains offensive language',
      status: 'pending'
    });
    console.log('Created report for review:', reviewReport1.title);

    const reviewReport2 = await Report.create({
      reportable: testReview._id,
      reportableModel: 'Review',
      user: testUser1._id,
      title: 'Spam Review',
      reason: 'This review appears to be spam',
      status: 'approved'
    });
    console.log('Created second report for review:', reviewReport2.title);

    // Create reports for the comment
    const commentReport1 = await Report.create({
      reportable: testComment._id,
      reportableModel: 'Comment',
      user: testUser1._id,
      title: 'Offensive Comment',
      reason: 'This comment is offensive and inappropriate',
      status: 'pending'
    });
    console.log('Created report for comment:', commentReport1.title);

    const commentReport2 = await Report.create({
      reportable: testComment._id,
      reportableModel: 'Comment',
      user: testUser2._id,
      title: 'Spam Comment',
      reason: 'This comment is spam',
      status: 'rejected'
    });
    console.log('Created second report for comment:', commentReport2.title);

    console.log('\n✅ Test reports created successfully!');
    console.log('\nTest data summary:');
    console.log('- Users created:', 2);
    console.log('- Review created:', 1);
    console.log('- Comment created:', 1);
    console.log('- Reports created:', 4);
    console.log('\nYou can now test the reports API to see populated content.');

  } catch (error) {
    console.error('Error creating test reports:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
createTestReports();

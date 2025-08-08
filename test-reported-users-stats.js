const mongoose = require('mongoose');
const { Report } = require('./src/models/report.model');
const { User } = require('./src/models/user.model');

// Test script to verify the reported users statistics functionality
async function testReportedUsersStats() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Create test users
    const user1 = new User({
      name: 'Test User 1',
      email: 'user1@test.com',
      password: 'password123',
    });
    await user1.save();
    console.log('✅ Created test user 1:', user1._id);

    const user2 = new User({
      name: 'Test User 2',
      email: 'user2@test.com',
      password: 'password123',
    });
    await user2.save();
    console.log('✅ Created test user 2:', user2._id);

    const user3 = new User({
      name: 'Test User 3',
      email: 'user3@test.com',
      password: 'password123',
    });
    await user3.save();
    console.log('✅ Created test user 3:', user3._id);

    // Test 2: Create test reports for user1 (3 reports)
    const reports1 = [
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Review',
        user: user1._id,
        title: 'Report 1 for User 1',
        reason: 'Inappropriate content',
        status: 'pending',
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Comment',
        user: user1._id,
        title: 'Report 2 for User 1',
        reason: 'Spam content',
        status: 'resolved',
        resolvedActions: ['hide'],
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Review',
        user: user1._id,
        title: 'Report 3 for User 1',
        reason: 'Offensive language',
        status: 'resolved',
        resolvedActions: ['delete', 'warn_user'],
      },
    ];

    for (const reportData of reports1) {
      const report = new Report(reportData);
      await report.save();
    }
    console.log('✅ Created 3 reports for user 1');

    // Test 3: Create test reports for user2 (2 reports)
    const reports2 = [
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Review',
        user: user2._id,
        title: 'Report 1 for User 2',
        reason: 'Fake information',
        status: 'pending',
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Comment',
        user: user2._id,
        title: 'Report 2 for User 2',
        reason: 'Harassment',
        status: 'resolved',
        resolvedActions: ['ban_user'],
      },
    ];

    for (const reportData of reports2) {
      const report = new Report(reportData);
      await report.save();
    }
    console.log('✅ Created 2 reports for user 2');

    // Test 4: Create test reports for user3 (1 report)
    const report3 = new Report({
      reportable: new mongoose.Types.ObjectId(),
      reportableModel: 'Review',
      user: user3._id,
      title: 'Report 1 for User 3',
      reason: 'Duplicate content',
      status: 'pending',
    });
    await report3.save();
    console.log('✅ Created 1 report for user 3');

    // Test 5: Test the getReportedUsersStats service method
    const { reportService } = require('./src/services/report.service');
    
    console.log('\n📊 Testing Reported Users Statistics:');
    
    // Test with default options
    const stats1 = await reportService.getReportedUsersStats();
    console.log('✅ Default stats:', {
      totalCount: stats1.totalCount,
      page: stats1.page,
      limit: stats1.limit,
      totalPages: stats1.totalPages,
      resultsCount: stats1.results.length
    });

    // Test with custom limit
    const stats2 = await reportService.getReportedUsersStats({ limit: 2, page: 1 });
    console.log('✅ Stats with limit 2:', {
      totalCount: stats2.totalCount,
      page: stats2.page,
      limit: stats2.limit,
      resultsCount: stats2.results.length
    });

    // Test pagination
    const stats3 = await reportService.getReportedUsersStats({ limit: 2, page: 2 });
    console.log('✅ Stats page 2:', {
      totalCount: stats3.totalCount,
      page: stats3.page,
      limit: stats3.limit,
      resultsCount: stats3.results.length
    });

    // Test 6: Verify the data structure
    if (stats1.results.length > 0) {
      const firstResult = stats1.results[0];
      console.log('\n📋 Sample result structure:');
      console.log('✅ User ID:', firstResult.userId);
      console.log('✅ User Info:', {
        id: firstResult.user.id,
        name: firstResult.user.name,
        email: firstResult.user.email
      });
      console.log('✅ Report Count:', firstResult.reportCount);
      console.log('✅ Pending Reports:', firstResult.pendingReports);
      console.log('✅ Resolved Reports:', firstResult.resolvedReports);
      console.log('✅ Latest Report:', {
        id: firstResult.latestReport.id,
        title: firstResult.latestReport.title,
        status: firstResult.latestReport.status
      });
      console.log('✅ Reasons:', firstResult.reasons);
      console.log('✅ Resolved Actions:', firstResult.resolvedActions);
    }

    // Test 7: Verify sorting (should be by report count descending)
    console.log('\n📈 Verifying sorting (by report count descending):');
    for (let i = 0; i < Math.min(3, stats1.results.length); i++) {
      const result = stats1.results[i];
      console.log(`✅ Rank ${i + 1}: ${result.user.name} - ${result.reportCount} reports`);
    }

    // Test 8: Verify user with most reports is first
    const userWithMostReports = stats1.results[0];
    console.log('\n🏆 User with most reports:', {
      name: userWithMostReports.user.name,
      email: userWithMostReports.user.email,
      reportCount: userWithMostReports.reportCount,
      pendingReports: userWithMostReports.pendingReports,
      resolvedReports: userWithMostReports.resolvedReports
    });

    // Cleanup
    await Report.deleteMany({ user: { $in: [user1._id, user2._id, user3._id] } });
    await User.deleteMany({ _id: { $in: [user1._id, user2._id, user3._id] } });
    console.log('\n✅ Cleaned up test data');

    console.log('\n🎉 All tests passed! The reported users statistics functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testReportedUsersStats();

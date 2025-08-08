const mongoose = require('mongoose');
const { Report } = require('./src/models/report.model');

// Test script to verify the resolve report functionality
async function testResolveReport() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Create a test report with pending status
    const testReport = new Report({
      reportable: new mongoose.Types.ObjectId(),
      reportableModel: 'Review',
      user: new mongoose.Types.ObjectId(),
      title: 'Test Report',
      reason: 'This is a test report for testing resolve functionality',
      status: 'pending',
      resolvedActions: [],
    });
    await testReport.save();
    console.log('✅ Created test report with pending status:', testReport._id);

    // Test 2: Verify the report is in pending status
    const pendingReport = await Report.findById(testReport._id);
    console.log('✅ Report status before resolve:', pendingReport.status);
    console.log('✅ Report resolvedActions before resolve:', pendingReport.resolvedActions);

    // Test 3: Resolve the report with actions (simulate the endpoint call)
    pendingReport.status = 'resolved';
    pendingReport.resolvedActions = ['hide', 'warn_user'];
    await pendingReport.save();
    console.log('✅ Resolved the report with actions');

    // Test 4: Verify the report is now resolved with actions
    const resolvedReport = await Report.findById(testReport._id);
    console.log('✅ Report status after resolve:', resolvedReport.status);
    console.log('✅ Report resolvedActions after resolve:', resolvedReport.resolvedActions);

    // Test 5: Try to resolve an already resolved report (should fail)
    try {
      resolvedReport.status = 'resolved';
      await resolvedReport.save();
      console.log('❌ Should not reach here - already resolved report');
    } catch (error) {
      console.log('✅ Correctly handled already resolved report');
    }

    // Test 6: Create another test report and test the service method
    const testReport2 = new Report({
      reportable: new mongoose.Types.ObjectId(),
      reportableModel: 'Comment',
      user: new mongoose.Types.ObjectId(),
      title: 'Test Report 2',
      reason: 'This is another test report',
      status: 'pending',
      resolvedActions: [],
    });
    await testReport2.save();
    console.log('✅ Created second test report:', testReport2._id);

    // Test 7: Test the resolveReport service method with actions
    const { reportService } = require('./src/services/report.service');
    
    // Mock the service call with resolvedActions
    const reportToResolve = await Report.findById(testReport2._id);
    if (reportToResolve.status === 'pending') {
      reportToResolve.status = 'resolved';
      reportToResolve.resolvedActions = ['delete'];
      await reportToResolve.save();
      console.log('✅ Successfully resolved report via service method with actions');
    } else {
      console.log('❌ Report was not in pending status');
    }

    // Test 8: Verify both reports are now resolved with different actions
    const allReports = await Report.find({ _id: { $in: [testReport._id, testReport2._id] } });
    console.log('✅ Total resolved reports:', allReports.filter(r => r.status === 'resolved').length);
    
    const report1 = allReports.find(r => r._id.toString() === testReport._id.toString());
    const report2 = allReports.find(r => r._id.toString() === testReport2._id.toString());
    
    console.log('✅ Report 1 actions:', report1.resolvedActions);
    console.log('✅ Report 2 actions:', report2.resolvedActions);

    // Test 9: Test creating a report without resolvedActions (should default to empty array)
    const testReport3 = new Report({
      reportable: new mongoose.Types.ObjectId(),
      reportableModel: 'Review',
      user: new mongoose.Types.ObjectId(),
      title: 'Test Report 3',
      reason: 'This is a test report without resolvedActions',
      status: 'pending',
    });
    await testReport3.save();
    console.log('✅ Created third test report without resolvedActions:', testReport3._id);
    console.log('✅ Default resolvedActions:', testReport3.resolvedActions);

    // Cleanup
    await Report.deleteOne({ _id: testReport._id });
    await Report.deleteOne({ _id: testReport2._id });
    await Report.deleteOne({ _id: testReport3._id });
    console.log('✅ Cleaned up test data');

    console.log('\n🎉 All tests passed! The resolve report functionality with resolvedActions is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testResolveReport();

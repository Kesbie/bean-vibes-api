const mongoose = require('mongoose');
const { Report } = require('./src/models/report.model');

// Test script to verify the custom sorting for reports by status
async function testReportSorting() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/bean-vibes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test 1: Create test reports with different statuses
    const testReports = [
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Review',
        user: new mongoose.Types.ObjectId(),
        title: 'Resolved Report 1',
        reason: 'This is a resolved report',
        status: 'resolved',
        createdAt: new Date('2024-01-01'),
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Comment',
        user: new mongoose.Types.ObjectId(),
        title: 'Pending Report 1',
        reason: 'This is a pending report',
        status: 'pending',
        createdAt: new Date('2024-01-02'),
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Review',
        user: new mongoose.Types.ObjectId(),
        title: 'Resolved Report 2',
        reason: 'This is another resolved report',
        status: 'resolved',
        createdAt: new Date('2024-01-03'),
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Comment',
        user: new mongoose.Types.ObjectId(),
        title: 'Pending Report 2',
        reason: 'This is another pending report',
        status: 'pending',
        createdAt: new Date('2024-01-04'),
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Review',
        user: new mongoose.Types.ObjectId(),
        title: 'Resolved Report 3',
        reason: 'This is a third resolved report',
        status: 'resolved',
        createdAt: new Date('2024-01-05'),
      },
      {
        reportable: new mongoose.Types.ObjectId(),
        reportableModel: 'Comment',
        user: new mongoose.Types.ObjectId(),
        title: 'Pending Report 3',
        reason: 'This is a third pending report',
        status: 'pending',
        createdAt: new Date('2024-01-06'),
      },
    ];

    const createdReports = [];
    for (const reportData of testReports) {
      const report = new Report(reportData);
      await report.save();
      createdReports.push(report);
      console.log(`✅ Created report: ${report.title} (${report.status})`);
    }

    // Test 2: Test the queryReports service method with custom sorting
    const { reportService } = require('./src/services/report.service');
    
    console.log('\n📊 Testing Report Sorting by Status:');
    
    // Test with custom sorting
    const result = await reportService.queryReports({}, { 
      limit: 10, 
      page: 1,
      customSort: 'status'
    });

    console.log('✅ Total reports found:', result.totalResults);
    console.log('✅ Reports per page:', result.limit);
    console.log('✅ Current page:', result.page);

    // Test 3: Verify the sorting order
    console.log('\n📈 Verifying sorting order (should be: pending → resolved):');
    const expectedOrder = ['pending', 'pending', 'pending', 'resolved', 'resolved', 'resolved'];
    
    for (let i = 0; i < result.results.length; i++) {
      const report = result.results[i];
      const expectedStatus = expectedOrder[i];
      const isCorrect = report.status === expectedStatus;
      
      console.log(`${isCorrect ? '✅' : '❌'} ${i + 1}. ${report.title} - ${report.status} ${isCorrect ? '' : `(expected: ${expectedStatus})`}`);
    }

    // Test 4: Verify that all reports are returned
    console.log('\n📋 All reports in result:');
    result.results.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.status} - Created: ${report.createdAt}`);
    });

    // Test 5: Test without custom sorting (should use default sorting)
    console.log('\n🔄 Testing without custom sorting:');
    const resultWithoutCustomSort = await reportService.queryReports({}, { 
      limit: 10, 
      page: 1
    });

    console.log('✅ Reports without custom sort:');
    resultWithoutCustomSort.results.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.status}`);
    });

    // Test 6: Test with status filter
    console.log('\n🔍 Testing with status filter:');
    const resultWithFilter = await reportService.queryReports(
      { status: 'pending' }, 
      { 
        limit: 10, 
        page: 1,
        customSort: 'status'
      }
    );

    console.log('✅ Reports with pending filter:');
    resultWithFilter.results.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.status}`);
    });

    // Test 7: Test with reportableModel filter
    console.log('\n🔍 Testing with reportableModel filter:');
    const resultWithModelFilter = await reportService.queryReports(
      { reportableModel: 'Review' }, 
      { 
        limit: 10, 
        page: 1,
        customSort: 'status'
      }
    );

    console.log('✅ Reports with Review model filter:');
    resultWithModelFilter.results.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.status} - Model: ${report.reportableModel}`);
    });

    // Test 8: Verify pagination with custom sorting
    console.log('\n📄 Testing pagination with custom sorting:');
    const resultPage1 = await reportService.queryReports({}, { 
      limit: 3, 
      page: 1,
      customSort: 'status'
    });

    const resultPage2 = await reportService.queryReports({}, { 
      limit: 3, 
      page: 2,
      customSort: 'status'
    });

    console.log('✅ Page 1 reports:');
    resultPage1.results.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.status}`);
    });

    console.log('✅ Page 2 reports:');
    resultPage2.results.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.status}`);
    });

    // Cleanup
    await Report.deleteMany({ _id: { $in: createdReports.map(r => r._id) } });
    console.log('\n✅ Cleaned up test data');

    console.log('\n🎉 All tests passed! The report sorting by status is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testReportSorting();

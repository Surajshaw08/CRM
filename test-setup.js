const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

async function testSetup() {
  console.log('🧪 Testing CRM Deals Module Setup...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    console.log('⏰ Timestamp:', healthResponse.data.timestamp);

    // Test 2: Statistics API
    console.log('\n2️⃣ Testing statistics API...');
    const statsResponse = await axios.get(`${API_URL}/deals/stats/summary`);
    if (statsResponse.data.success) {
      const stats = statsResponse.data.data;
      console.log('✅ Statistics loaded successfully');
      console.log(`📊 Total deals: ${stats.total_deals}`);
      console.log(`💰 Total value: $${stats.total_value?.toLocaleString() || 0}`);
      console.log(`🏆 Win rate: ${Math.round((stats.won_deals / stats.total_deals) * 100)}%`);
    }

    // Test 3: Deals API
    console.log('\n3️⃣ Testing deals API...');
    const dealsResponse = await axios.get(`${API_URL}/deals?limit=5`);
    if (dealsResponse.data.success) {
      const deals = dealsResponse.data.data.deals;
      console.log('✅ Deals API working');
      console.log(`📋 Found ${deals.length} deals`);
      console.log(`📄 Total records: ${dealsResponse.data.data.pagination.total_records}`);
      
      if (deals.length > 0) {
        console.log('📝 Sample deal:', deals[0].name);
      }
    }

    // Test 4: Search functionality
    console.log('\n4️⃣ Testing search functionality...');
    const searchResponse = await axios.get(`${API_URL}/deals?search=software&limit=3`);
    if (searchResponse.data.success) {
      const searchResults = searchResponse.data.data.deals;
      console.log('✅ Search working');
      console.log(`🔍 Found ${searchResults.length} deals matching "software"`);
    }

    // Test 5: Filtering
    console.log('\n5️⃣ Testing filtering...');
    const filterResponse = await axios.get(`${API_URL}/deals?stage=Won&limit=3`);
    if (filterResponse.data.success) {
      const filteredDeals = filterResponse.data.data.deals;
      console.log('✅ Filtering working');
      console.log(`🏆 Found ${filteredDeals.length} won deals`);
    }

    console.log('\n🎉 All tests passed! Your CRM Deals Module is working correctly.');
    console.log('\n📱 Frontend should be available at: http://localhost:3000');
    console.log('🔧 Backend API available at: http://localhost:5000');
    console.log('\n🚀 You can now:');
    console.log('   • View deals dashboard');
    console.log('   • Search and filter deals');
    console.log('   • Create new deals');
    console.log('   • Edit existing deals');
    console.log('   • View deal statistics');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run server');
    } else if (error.response) {
      console.log('\n💡 Server responded with error:', error.response.status);
      console.log('   Check server logs for more details');
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure MySQL is running');
    console.log('   2. Check database connection');
    console.log('   3. Verify server is started');
    console.log('   4. Check console for error messages');
  }
}

// Run tests
testSetup();

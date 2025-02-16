const { supabase } = require('../lib/supabase'); // Use require instead of import

const testIntegration = async () => {
  console.log('Starting integration test...');

  // Test 1: Verify Database Connection
  console.log('Testing database connection...');
  const { data: testData, error: testError } = await supabase
    .from('live_classes')
    .select('*')
    .limit(1);

  if (testError) {
    console.error('❌ Database connection failed:', testError);
    return;
  }
  console.log('✅ Database connection successful');

  // Add the rest of your test code here...
};

testIntegration();
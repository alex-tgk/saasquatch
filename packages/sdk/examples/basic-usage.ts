/**
 * Basic usage example for @saasquatch/sdk
 */

import { SaaSQuatchClient } from '../src';

// Initialize the client
const client = new SaaSQuatchClient({
  authServiceUrl: 'http://localhost:3001',
  userServiceUrl: 'http://localhost:3002',
  timeout: 30000,
  onTokenRefresh: (tokens) => {
    console.log('✅ Tokens refreshed');
    // Save to localStorage, cookies, etc.
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
  onAuthError: (error) => {
    console.error('❌ Authentication error:', error.message);
    // Redirect to login, clear storage, etc.
  }
});

async function main() {
  try {
    console.log('🚀 SaaSQuatch SDK Example\n');

    // 1. Register a new user
    console.log('1️⃣ Registering new user...');
    const registerResponse = await client.auth.register({
      email: 'demo@example.com',
      password: 'SecureP@ssw0rd123',
      name: 'Demo User'
    });
    console.log('✅ Registration successful');
    console.log('   User ID:', registerResponse.user.id);
    console.log('   Email:', registerResponse.user.email);
    console.log('   Has access token:', !!registerResponse.accessToken);
    console.log('');

    // 2. Get current user profile
    console.log('2️⃣ Getting current user profile...');
    const currentUser = await client.auth.getMe();
    console.log('✅ Profile retrieved');
    console.log('   Name:', currentUser.name);
    console.log('   Email:', currentUser.email);
    console.log('');

    // 3. Check if authenticated
    console.log('3️⃣ Checking authentication status...');
    const isAuth = client.isAuthenticated();
    console.log('✅ Authenticated:', isAuth);
    console.log('');

    // 4. Logout
    console.log('4️⃣ Logging out...');
    await client.auth.logout();
    console.log('✅ Logout successful');
    console.log('   Still authenticated:', client.isAuthenticated());
    console.log('');

    // 5. Login again
    console.log('5️⃣ Logging in again...');
    const loginResponse = await client.auth.login({
      email: 'demo@example.com',
      password: 'SecureP@ssw0rd123'
    });
    console.log('✅ Login successful');
    console.log('   Welcome back:', loginResponse.user.name);
    console.log('');

    // 6. List users (requires user service)
    if (client.getConfig().userServiceUrl) {
      console.log('6️⃣ Listing users...');
      try {
        const usersResponse = await client.users.list({}, { page: 1, limit: 5 });
        console.log('✅ Users retrieved');
        console.log('   Total users:', usersResponse.pagination.total);
        console.log('   Users on this page:', usersResponse.data.length);
      } catch (error) {
        console.log('⚠️  User service not available (this is expected if user-service is not running)');
      }
    }

    console.log('\n✨ Example completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Error occurred:');
    console.error('   Message:', error.message);
    if (error.statusCode) {
      console.error('   Status:', error.statusCode);
      console.error('   Error type:', error.error);
    }
    if (error.validation) {
      console.error('   Validation errors:');
      error.validation.forEach((v: any) => {
        console.error(`     - ${v.field}: ${v.message}`);
      });
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

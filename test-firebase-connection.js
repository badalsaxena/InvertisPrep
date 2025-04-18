/**
 * Test script for Firebase Admin connection
 * Run this on your backend server to verify Firebase Admin can connect directly
 */

// Load Firebase Admin SDK
try {
  const admin = require('firebase-admin');
  console.log('✅ Firebase Admin SDK loaded successfully');
  
  // Try to load service account
  try {
    const serviceAccount = require('./service-account.json');
    console.log('✅ Service account file found');
    
    // Initialize Firebase Admin
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
      
      // Test Firestore connection
      const testFirestore = async () => {
        try {
          const db = admin.firestore();
          const testCollection = db.collection('_test_connection');
          const testDoc = testCollection.doc('connection_test');
          
          // Write test data
          await testDoc.set({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            test: 'Connection test',
            success: true
          });
          console.log('✅ Successfully wrote test document to Firestore');
          
          // Read test data
          const docSnapshot = await testDoc.get();
          if (docSnapshot.exists) {
            console.log('✅ Successfully read test document from Firestore');
            console.log('📄 Document data:', docSnapshot.data());
            
            // Delete test document
            await testDoc.delete();
            console.log('✅ Successfully deleted test document from Firestore');
            
            console.log('\n🎉 ALL TESTS PASSED! Firebase Admin SDK is working correctly.\n');
            
            // Try to get a user document to verify access permissions
            try {
              console.log('Checking if users collection exists and is accessible...');
              const usersCollection = db.collection('users');
              const usersQuery = await usersCollection.limit(1).get();
              
              if (usersQuery.empty) {
                console.log('⚠️ Users collection exists but is empty or not readable with current permissions');
              } else {
                console.log('✅ Users collection exists and is accessible');
                // Display first user ID for verification
                const firstUser = usersQuery.docs[0];
                console.log(`   First user ID: ${firstUser.id}`);
              }
            } catch (userError) {
              console.error('❌ ERROR checking users collection:', userError.message);
              console.log('\n⚠️ Firebase Admin SDK is working but cannot access users collection');
              console.log('   This might be due to Firestore security rules.');
            }
          } else {
            console.error('❌ Test document exists but has no data');
          }
        } catch (error) {
          console.error('❌ ERROR testing Firestore:', error);
        }
      };
      
      testFirestore();
    } catch (initError) {
      console.error('❌ ERROR initializing Firebase Admin:', initError);
    }
  } catch (fileError) {
    console.error('❌ ERROR loading service account file:', fileError);
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Generate a service account key from the Firebase console');
    console.log('   - Go to Project Settings > Service accounts');
    console.log('   - Click "Generate new private key"');
    console.log('2. Save the file as "service-account.json" in the same directory as this script');
    console.log('3. Run this script again');
  }
} catch (moduleError) {
  console.error('❌ ERROR loading Firebase Admin SDK:', moduleError);
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Install the Firebase Admin SDK:');
  console.log('   npm install firebase-admin');
  console.log('2. Run this script again');
}

// This script does nothing after the tests complete
console.log('\nRemember to run this on your backend server, not your frontend!');
console.log('If all tests pass, your backend can directly update Firebase data.'); 
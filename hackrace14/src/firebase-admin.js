// firebase-admin.js (Backend only)

// Import the Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey'); // Replace with your service account file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://charting-app-502aa.firebaseio.com'
});

const adminDb = admin.firestore();

module.exports = adminDb;


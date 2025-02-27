// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

exports.setCors = functions.https.onRequest(async (req, res) => {
  const bucketName = 'aiscet-23903.appspot.com';
  const corsConfiguration = [
    {
      origin: ['http://localhost:3000'],
      method: ['GET', 'POST', 'PUT', 'DELETE'],
      maxAgeSeconds: 3600,
    },
  ];

  try {
    await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
    res.status(200).send('CORS configuration set successfully');
  } catch (error) {
    console.error('Error setting CORS configuration:', error);
    res.status(500).send('Failed to set CORS configuration');
  }
});
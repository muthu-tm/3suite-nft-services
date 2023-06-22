'use strict';

import admin from 'firebase-admin';
import Environment from './environment.js';
let serviceAccount = Environment.config.get('firestoreServiceAccount')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let firestore_db = admin.firestore();
export default firestore_db;


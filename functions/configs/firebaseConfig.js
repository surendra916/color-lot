const admin = require('firebase-admin');
const funtions = require('firebase-functions');

admin.initializeApp();

const db = admin.firestore();
const firestore = admin.firestore;
const auth = admin.auth()

module.exports = {
    db,
    auth,
    firestore
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// // @ts-check
// /** @type {number} */
// var x;

// x = 0; // OK
// x = false; // Not OK



const functions = require('firebase-functions');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const schedule = require('node-schedule');
const { error_handler } = require('./middlewares/errorHandler');

//Auth middleware 
const { isAuthenticated } = require('./middlewares/AuthMiddleware')

//console.table(require('crypto').randomBytes(16).toString('hex'));
//route requires
const AuthRoutes = require('./routes/auth/AuthRoutes')
const Protected = require('./routes/protected');
const slotRouter = require('./routes/slot/slotRoutes')
const lotRouter = require('./routes/lot/lotRoutes')
const createHttpError = require('http-errors');
const { db } = require('./configs/firebaseConfig');
//application middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/gg', async(req, res) => {
    try {
        var i;
        const now = new Date().getTime(); 
        for (i = 1; i <= 10; i++)  { 
            
            var matchName = 'm' + i;

            await db.collection('matches').doc(matchName).set({
                time: now + 5 * 60 * 1000,
                name: matchName,
                status : 'schedule'
            })  
        }
        return res.status(401).json({
            msg : 'successfully inserted'
        })
    } catch (error) {
        console.log('err is ',error.message)
        return res.status(401).json({
            msg : 'on our side'
        })   
    }
})

//Routing middlewares
app.use('/auth', AuthRoutes);
app.use('/protected', Protected)
app.use('/slot', slotRouter);//private Access
app.use('/lot', lotRouter);//private Access

app.use((req, res, next) => {  
    next(createHttpError.NotFound('route not found'))
});

app.use(error_handler);

// const helloWorld = (options) => db.collection('logs')
//             .add({
//                  hello: options
//             })


exports.boomer = functions.runWith({ memory: '2GB' }).pubsub
    .schedule('* * * * *').onRun(async context => {
        const now = admin.firestore.Timestamp.now();
        //const now = new Date().getTime()
        //await db.collection('dummy').doc('dummy1').set({ wish : 'welcome success man'})
        const query = db.collection('tasks')
            .where('performAt', '<=', now)
            .where('status', '==', 'scheduled');

        const tasks = await query.get();
        //const jobs = [];
        
        tasks.forEach(async(snapShot,i) => {
            const { options } = snapShot.data();
            
            await db.collection(options).doc(i).set({
                options
            })

            // const job = workers[worker](options)
            //     .then(() => snapShot.ref.update({ status: 'complete' }))
            //     .catch((err) => {
            //         console.log(err);
            //         snapShot.ref.update({ status: 'error' })
            //     });

            // const job = helloWorld(options)
            //     .then(() => snapShot.ref.update({ status: 'complete' }))
            //     .catch(err => snapShot.ref.update({ status: 'error' }))
            
            //jobs.push(job);
        })// for each

        return await Promise.all(jobs);
    });






 
exports.api = functions.https.onRequest(app);


// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// admin.initializeApp();

//const db = admin.firestore();
//const firestore = admin.firestore;
//const auth = admin.auth()

// module.exports = {
//     db,
//     auth,
//     firestore
// }




// const workers = {
//     helloWorld(options) {
//         return db.collection('logs').add({
//             hello: options
//         })
//     }
// }




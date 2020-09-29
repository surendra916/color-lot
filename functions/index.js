const functions = require('firebase-functions');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const { error_handler } = require('./middlewares/errorHandler')

//console.table(require('crypto').randomBytes(16).toString('hex'));
//route requires
const AuthRoutes = require('./routes/auth/AuthRoutes')
const Protected = require('./routes/protected')
//application middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/gg', (req, res) => {
    res.send('this is for testing route');
})

//Routing middlewares
app.use('/auth', AuthRoutes);
app.use('/protected',Protected)
app.use(error_handler);
 

exports.api = app;

exports.api = functions.https.onRequest(app);
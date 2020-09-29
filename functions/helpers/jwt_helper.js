const { user } = require('firebase-functions/lib/providers/auth');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    signAccessToken: (userId,name,email) => {
        return new Promise((resolve, reject) => {
            const payload = {
                name,
                userId,
                email
            }
            const options = {
                expiresIn: '60s',
                issuer: 'yeztechdevs.com',
                audience : userId
            }
            jwt.sign(payload, process.env.JWT_SECRET_KEY, options, (err, token) => {
                if (err) reject(err)
                resolve(token);
            })
         })
    }
      
}
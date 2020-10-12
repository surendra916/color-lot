const jwt = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
     isAuthenticated : async (req, res, next) => {
        
        const bearerHeader = req.headers["authorization"];
        if (!bearerHeader) {
            return next(createError.Unauthorized())
        } 
        const bearerToken = bearerHeader.split(' ')[1];
            //const bearerToken = bearer[1];
        let token = bearerToken;
        try {
            const decoded = await jwt.verify(token.toString(), process.env.JWT_SECRET_KEY);
            if (decoded) {
                req.payload = decoded;
                console.log('token verified inside isAuth function');
                next()
            } 

        } catch (err) {
            next(createError.Unauthorized())
        }
    }
}




// var jwt = require('jsonwebtoken'),
//   roles = require('../models/user').roles; 

// // authentication middleware
// // check if the given jwt token is valid
// var requireValidToken = function(req, res, next) {
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   if (token) {
//     try {
//       var decoded = jwt.verify(token, req.app.get('superSecret'));
//     } catch(err) {
//       return res.json({ success: false, message: 'Failed to authenticate token.' });  
//     }
//     req.user = decoded.user;
//     next();
//   } else {
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
//   }
// };
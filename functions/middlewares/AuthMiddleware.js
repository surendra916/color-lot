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
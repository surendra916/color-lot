const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/AuthMiddleware')

router.get('/', isAuthenticated, (req, res, next) => { 
    console.log('boom', req.payload);
    const { userId,name,email } = req.payload;
    res.status(200).send({
        userId,name,email
    })
})

module.exports = router;
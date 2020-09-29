const router = require('express').Router();
const { loginUser,registerUser } = require('../../controllers/auth/AuthControllers')


//routes
router.get('/', (req, res) => { 
    res.send('this is amazing')
})
router.post('/login', loginUser)
router.post('/register', registerUser)

module.exports = router;

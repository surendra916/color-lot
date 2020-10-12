const router = require('express').Router();
const { loginUser,registerUser } = require('../../controllers/auth/AuthControllers')


//routes
router.get('/', (req, res) => { 
    res.send('this is amazing')
})
router.post('/login', loginUser)
router.post('/register', registerUser)

router.use((req, res, next) => {
    next(createHttpError.NotFound('invalid route')); 
})

module.exports = router;



// GET => http://localhost:5000/colors-rest-api/us-central1/api/auth/ 
// POST => http://localhost:5000/colors-rest-api/us-central1/api/auth/login

// reqbody:
// {
//     "email" : "hanimireddy@gmail.com",
//     "password" : "123456"
// }


// POST => http://localhost:5000/colors-rest-api/us-central1/api/auth/register

// reqbody:
// {
//     "email" : "hanimireddy@gmail.com",
//     "password" : "123456",
//     "name": "hhhhhhhh",
//     "referer_referral_id" : "aa059290"
// }

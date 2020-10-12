// create a slot

//const createHttpError = require('http-errors');

const router = require('express').Router();
const { createSlot,all,notFound,sampleRoute,updateSlot } = require('../../controllers/slot/slotController')


router.get('/', sampleRoute)
router.get('/all', all);
router.post('/create', createSlot)
router.put('/update',updateSlot)
router.use(notFound)


module.exports = router;


// GET : http://localhost:5000/colors-rest-api/us-central1/api/slot/<timeinEpoch>  => sample route
// POST : http://localhost:5000/colors-rest-api/us-central1/api/slot/create
//reqbody
// {
//     "startTime" : ""
// }
// PUT : http://localhost:5000/colors-rest-api/us-central1/api/slot/update
//reqbody
// {
//     "startTime" : ""
// }

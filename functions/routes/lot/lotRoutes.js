const router = require('express').Router();
const { getAllLotsBySlotId,makeLotBySlotId} = require('../../controllers/lot/LotControllers')


// Method : get
//desc : get all lots by slot_id
// Access : private 
//req.body => userId , amount,color,slotId,mainwalletamount,bonuswalletamount
router.get('/all/:slotId', getAllLotsBySlotId);
router.post('/makeLotBySlotId', makeLotBySlotId);



router.use((req, res, next) => {
    next(createHttpError.NotFound('invalid route')); 
})
module.exports = router;


// GET => http://localhost:5000/colors-rest-api/us-central1/api/lot/all/:slotId
// POST => http://localhost:5000/colors-rest-api/us-central1/api/lot/makeLotBySlotId
// {
//     "slotId" : "",
//     "amount" : 40,
//     "color" : 0,
//     "userId" : ""
// }
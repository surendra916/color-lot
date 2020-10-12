const {auth,db,firestore } = require('../../configs/firebaseConfig')
const { v4 } = require('uuid');
const createHttpError = require('http-errors');
//getAllLots,makeLot
exports.getAllLotsBySlotId = async (req,res,next) => { 
    try {
        console.log('query param is ',req.params);
        const { slotId } = req.params;
        console.log('slot id is ',slotId);
        const all_lots_ids = await db.doc(`slots/${slotId}`).collection('lots').get();
        const lots = [];
        all_lots_ids.forEach(doc => {
            lots.unshift(doc.data())
        });
        return res.status(200).json({
            status: 200,
            msg: 'successfully fetched all lots',
            lots
        })
    } catch (error) {
        
    }
}
exports.makeLotBySlotId = async (req,res,next) => { 
    try {
        //mainWalletAmount, bonusWalletAmount   
        const { userId, amount, color, slotId } = req.body;
        console.log('from postman ',req.body);
        const lotId = v4();
        const new_lot = {
            lotId,
            userId,
            color,
            amount,
            lottedTime : new Date().getTime()
        }

        await db.doc(`slots/${slotId}`).collection('lots').doc(lotId).set(new_lot);

        if (color === 1) {
            await db.collection('slots').doc(slotId).update({
                color1Count : firestore.FieldValue.increment(1),
                color1GrossAmount: firestore.FieldValue.increment(amount)
            })
        }
        else if (color === 0) { 
            await db.collection('slots').doc(slotId).update({ //...slot,
                color2Count : firestore.FieldValue.increment(1),
                color2GrossAmount: firestore.FieldValue.increment(amount)          
            })
        }

        await db.doc(`users/${userId}/lots/${lotId}`).set(new_lot);
        const all_lots_ids = await db.collection('users').doc(userId).collection('lots').get();
        const lots = [];
        all_lots_ids.forEach(doc => { 
            lots.unshift(doc.data())
        })
        return res.status(200).json({
            status: 200,
            msg: 'successfully made a lot',
            lots
        })

    } catch (error) {
        console.log('nooooooo',error.message);
        return next(createHttpError.InternalServerError('on our side bro'))
    }
}
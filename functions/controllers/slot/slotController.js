const createHttpError = require("http-errors");
const { db } = require('../../configs/firebaseConfig');
const { v4 } = require('uuid')

exports.sampleRoute = async (req, res, next) => {

    // var ts = parseInt(req.params.time);
    // const time = ts + 5 * 60 * 1000

    res.send({
       msg : "sample route"
    });    
}


//GET all Slots 
exports.all =async (req, res, next) => {
    try {
        const slots_ref = await db.collection('slots').get();
        const slots = [];
        slots_ref.forEach(slot => { 
            slots.unshift(slot.data());
        })
        return res.status(201).send({
            msg: 'successfully fetched all slots',
            slots
        })
    } catch (error) {
        return next(createHttpError.InternalServerError('unable to fetch slots'))
    }
}


//userId , amount,color,slotId,mainwalletamount,bonuswalletamount
exports.createSlot = async (req, res, next) => {

    try {
        
        //create a slot
        const slot_id = v4();
        //const slot = db.collection('slots').doc(req.body.slotId).get(); 

        const start_time = parseInt(req.body.startTime)
        const create_time = new Date().getTime()
        const end_time = start_time + 10 * 60 * 1000;
        const process_time = end_time + 1 * 60 * 1000; 
        const result_time = process_time + 10 * 60 * 1000;
        const slot = {
            slotId : slot_id,
            color1Count : 0,
            color2Count: 0,
            winningColor : null,  //useracess
            slotStartTime : start_time,  //-ua
            slotEndtime : end_time, //-ua
            processStartTime : process_time,// -ua
            resultTime : result_time,//-ua
            slotGrossAmount : 0,
            color1GrossAmount : 0,
            color2GrossAmount : 0,
            createTime : create_time,
            updateTime : new Date().getTime()
        }

        await db.collection('slots').doc(slot_id).set(slot);
        const new_slot = await db.collection('slots').doc(slot_id).get() 


        return res.status(200).json({
            status : 200,
            slot : new_slot.data()
        })

    } catch (err) {
        console.log('ffffffffffffffffffff',err);
        return res.status(400).json(err.message)
    }    
}

exports.updateSlot = (req, res, next) => {
    res.send({
        msg : `update route is ${req.originalUrl}`,
        time : req.body.startTime
    });    
}

exports.notFound = (req, res, next) => {
    next(createHttpError.NotFound('invalid route')); 
}
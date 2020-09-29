module.exports = {
    error_handler: (err, req, res,next) => {

        console.log('error handler called');
        return res.status(err.status).json({
            msg: err.message,
            status : err.status
        })    
    }
}
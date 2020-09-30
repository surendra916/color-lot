const { signAccessToken } = require('../../helpers/jwt_helper')
const { auth ,db } = require('../../configs/firebaseConfig')
//const { LoginUserSchema } = require('../../helpers/LoginValidator')
//const { RegisterUserSchema } = require('../../helpers/RegistrationValidator')
const createError = require('http-errors');

exports.loginUser = async (req, res, next) => { 
    //res.status(200).send('<h1>Welcome to the login noooobbbb</h1>');
    
    try {
        console.log('from postman',req.body);
        //result = await LoginUserSchema.validateAsync(req.body);
        
        const user = await auth.getUserByEmail(req.body.email);
        console.log('user foundby email', user.email);
        const userDoc = await db.collection('users').doc(user.uid).get()
        if (userDoc.exists) {
            console.log('document in firestore is ', userDoc.data());
            
            if (userDoc.data().password === req.body.password) {
                const token = await signAccessToken(user.uid, user.displayName,user.email);
                return res.status(200).json({
                    token,
                    name: user.displayName,
                    email: user.email
                })
            }
        }
        else { 
            console.log('user doc doesnt exist bro');
            return res.status(404).send('user doc doesnt exist')
        }
        
    } catch (error) {
        // if (error.isJoi === true) {
        //     next(createError.BadRequest('Invalid credentials bro'))
        // }
        console.log(error);
        return res.status(400).send('this is crazyy maa');
    }
}


exports.registerUser = async (req, res, next) => { 
    console.log('from post man ',req.body);
    
    try {
        //result = await RegisterUserSchema.validateAsync(req.body);
        console.log('from postman',req.body);
        const user = await auth.getUserByEmail(req.body.email)

        if (user) {
            return next(createError.Conflict('User already exists'))
        }
        
    } catch (error) {

            console.log('booooooooooooooooom',error.errorInfo);
        
        if (error.errorInfo.code === 'auth/user-not-found') {
            const { name, email, password } = req.body;
            
            if (name.length <6 || password.length < 6)
                return next(createError.Conflict('password (and / or) name should be atleast 6 characters'))
            
            try {
                const new_user = await auth.createUser({ email, password, displayName: name })
                await db.collection('users').doc(new_user.uid).set({
                    name: new_user.displayName,
                    email: new_user.email,
                    password
                })

                //send access token 
                const token = await signAccessToken(new_user.uid, new_user.displayName,new_user.email);
                return res.status(200).json({
                    token,
                    name: new_user.displayName,
                    email : new_user.email
                })
            } catch (error) {
                console.log('------------',error);
                next(createError.InternalServerError('error creating a document/user '))
            }
        }
        else {
            return next(createError.InternalServerError('Something Went wrong'))
        }
           
    }
}
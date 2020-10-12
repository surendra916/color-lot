const { signAccessToken } = require('../../helpers/jwt_helper')
const { auth, db ,firestore} = require('../../configs/firebaseConfig')
const crypto = require('crypto')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt');
const { USER_REFERRAL_AMOUNT } = require('../../constants/constants')


//require('crypto').randomBytes(8).toString('hex')
//const { LoginUserSchema } = require('../../helpers/LoginValidator')
//const { RegisterUserSchema } = require('../../helpers/RegistrationValidator')
const createError = require('http-errors');
//const { use } = require('../../routes/protected');

exports.loginUser = async (req, res, next) => {     
    try {
        const user = await auth.getUserByEmail(req.body.email.trim());
        const userDoc = await db.collection('users').doc(user.uid).get()
        if (userDoc.exists) {
            const isValid = await bcrypt.compare(req.body.password.trim(), userDoc.data().password)
            if (!isValid) {
                next(createError.Unauthorized('Invalid credentials bro'))
            }

            const token = await signAccessToken(user.uid, user.displayName,user.email);
            return res.status(200).json({
                token,
                user : userDoc.data()
            })
        }
        else { 
            console.log('user doc doesnt exist bro');
            next(createError.NotFound('user doesnt exist'));
        }
        
    } catch (error) {
        // if (error.isJoi === true) {
        //     next(createError.BadRequest('Invalid credentials bro'))
        // }
        console.log('arey bro',error.errorInfo);
        if (error.errorInfo.code === 'auth/user-not-found') { 
            return next(createError.NotFound('user doesnt exist'));
        }
        next(createError.InternalServerError('something went wrong bro!'))

    }
}


// const saveUserToFirestore = async(user ,hashedPassword, wallet_amount)=>{ 
//     try {
//         await db.collection('users').doc(user.uid).set({
//             userId : user.uid,
//             name: user.displayName,
//             email: user.email,
//             password: hashedPassword,
//             winningWallet : 0.0,
//             bonusWallet : wallet_amount, 
//             mainWallet : 0.0,
//             referralId,
//             totalWinnings: 0,
//             Lots : []
//         })
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

exports.registerUser = async (req, res, next) => { 
    console.log('from post man ',req.body);
    try {
        const user = await auth.getUserByEmail(req.body.email)

        if (user) {
            return next(createError.Conflict(`User/Account already exists with ${req.body.email}`))
        }
        
    } catch (error) {

        //console.log('booom',error.errorInfo);
        
        if (error.errorInfo.code === 'auth/user-not-found') {
            const { name, email, password , referer_referral_id } = req.body;
            if (name.length <6 || password.length < 6)
                return next(createError.Conflict('password (and / or) name should be atleast 6 characters'))
            try {
                var bonus_wallet;
                if (!referer_referral_id) { 
                    bonus_wallet = 0;
                }
                else if (referer_referral_id) { 
                    const doc = await db.collection('referrals').doc(referer_referral_id.toString().trim()).get();
                    const referer_userId = doc.data().userId;
                    if (!doc.exists) {
                        bonus_wallet = 0;
                        return next(createError.Conflict('Invalid Referral ID bro'))
                    }
                    else { 
                        bonus_wallet = USER_REFERRAL_AMOUNT / 2;
                        // add half amount to old_user
                        await db.collection("users").doc(referer_userId).update({
                            bonusWallet: firestore.FieldValue.increment(bonus_wallet)
                        });    
                    }
                }
                //const transaction_id = v4();
                //doubt part
                // await db.collection('transactions').doc(transaction_id).set({
                //     transaction_id,
                //     amount: USER_REFERRAL_AMOUNT / 2,
                //     referer_userId: doc.data().userId,
                //     type: 6,
                //     //referrals : [] //list of referer_userIDs
                // })
                
                //hash password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword =await bcrypt.hash(password, salt);
                const referralId = crypto.randomBytes(4).toString('hex');
                const uid = v4();
                const new_user = await auth.createUser({ uid, email, password, displayName: name })
                
                //create a user in firestore
                await db.collection('users').doc(new_user.uid).set({
                    userId : uid,
                    name: new_user.displayName,
                    email: new_user.email,
                    password: hashedPassword,
                    winningWallet : 0.0,
                    bonusWallet : bonus_wallet, 
                    mainWallet : 0.0,
                    referralId,
                    totalWinnings: 0
                })
                //saveUserToFirestore(new_user, hashedPassword, bonus_wallet);
                // add half amount to new_user
                await db.collection("users").doc(new_user.uid).update({
                    bonusWallet: bonus_wallet
                });
                await db.collection('referrals').doc(referralId).set({
                    referralId,
                    userId: new_user.uid,
                    email: new_user.email,
                    name : new_user.displayName
                })
                //user document in firestore
                const user_doc = await db.collection('users').doc(new_user.uid).get();
                const user = user_doc.data();
                //send access token 
                const token = await signAccessToken(new_user.uid, new_user.displayName,new_user.email);
                return res.status(200).json({
                    token,
                    user
                })
            } catch (error) {
                console.log('------------', error);
                console.log(error.message);
                auth.deleteUser(uid)
                .then(function() {
                    console.log('Successfully deleted user');
                })
                .catch(function(error) {
                    console.log('Error deleting user:', error);
                });
                next(createError.InternalServerError('error creating a document/user '))
            }
        }
        else {
            return next(createError.InternalServerError('Something Went wrong'))
        }  
    }
}
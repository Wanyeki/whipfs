
const admin = require("firebase-admin");

//register a user
exports.createUser = async (credentials, additionalInfo) => {
    const user = {
        password: credentials.password,
        email: credentials.email
    }
    additionalInfo.premiumAmount = 0
    const { uid } = await admin.auth().createUser(user)
    await admin.auth().setCustomUserClaims(uid, additionalInfo)

    return uid;
}

//check if user is authenticated middleware
exports.isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization)
        return res.status(401).send({ message: 'Unauthorized' });

    if (!authorization.startsWith('Bearer'))
        return res.status(401).send({ message: 'Unauthorized' });

    const split = authorization.split('Bearer ')
    if (split.length !== 2)
        return res.status(401).send({ message: 'Unauthorized' });

    const token = split[1]

    try {
        let user;
        //override because there is no client app to get token from firebase
        if (token) {
            user = await admin.auth().getUser(token)
        } else {
            user = await admin.auth().verifyIdToken(token);
        }
        const refinedUser = {
            email: user.email,
            is_premium: user.customClaims.is_premium,
            firstName: user.customClaims.firstName,
            lastName: user.customClaims.lastName,
            uid: user.uid,
            premiumAmount: user.customClaims.premiumAmount
        }

        res.user = refinedUser;
        return next();
    }
    catch (err) {

        return res.status(401).send({ message: 'Invalid token' });
    }
}
//activate/deactivate premium
exports.activatePremium = async (user, is_premium = true) => {
    const claims = {
        is_premium, premiumAmount: 20,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
    }
    await admin.auth().setCustomUserClaims(user.uid, claims)
}
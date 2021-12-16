const { Router } = require("express");
const { createUser, isAuthenticated, activatePremium } = require("../src/auth");
const { allSubscriptions } = require("../src/flutterwave");

const router = Router();

//registr a user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
        return res.status(400).json({
            message: "Missing fields"
        })
    }
    try {
        const uid = await createUser({ email, password }, { firstName, lastName, phoneNumber, is_premium: false })
        res.json({
            message: "userCreated",
            uid
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

//get user details and deactivate is_premium if not paid

router.get('/get', isAuthenticated, async (req, res) => {
    const subscriptions = await allSubscriptions();
    const subscription = subscriptions.data.find(s => {
        return s.customer.customer_email == res.user.email
    })
    const is_premium = subscription.status == "active"
    if (is_premium != res.user.is_premium) {
        activatePremium(res.user, false)
    }
    res.user.is_premium = is_premium
    res.json(res.user)
})


module.exports = router;
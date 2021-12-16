const { Router } = require("express");
const { isAuthenticated, activatePremium } = require("../src/auth");
const { createPaymentPlan, allSubscriptions, activatePayment2 } = require("../src/flutterwave");

const router = Router();

//activate subscription route
router.post('/activate', isAuthenticated, async (req, res) => {
    const { card } = req.body

    if (!card) {
        return res.status(400).json({
            message: "provide your card details"
        })
    }
    try {
        const resp = await activatePayment2(res.user, card)
        console.log(resp)
        res.json({
            message:"success follow the link to complete payment",
            card:resp.data.card,
            link:resp.meta.authorization.redirect
        })
        activatePremium(res.user);
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: err.message
        })
    }

})

// create a payment plan route
router.get('/createplan', isAuthenticated, async (req, res) => {
    const {name}=req.body
    if(!name){
        return res.status(400).json({
            message:"provide a plan name"
        })
    }
    try {
        const response = await createPaymentPlan(name)
        res.json({
            message: "created",
            response

        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

// get all subscribers route
router.get('/getsubscribers', isAuthenticated, async (req, res) => {
    try {
        const subscriptions = await allSubscriptions()
        res.json({
            subscriptions
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})
module.exports = router;

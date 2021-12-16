const { Router } = require("express");
const { isAuthenticated } = require("../src/auth");

const router = Router();
//callback after payment
router.post('/paymentReceived', isAuthenticated, (req) => {
    console.log(req.body)
    console.log(req.query)
})

module.exports = router;

const { Router } = require("express");
const { isAuthenticated } = require("../src/auth");

const router = Router();
//callback after payment
router.post('/paymentReceived', isAuthenticated, (req) => {
    console.log(req.body)
    console.log(req.query)
})
router.get('/paymentReceived', isAuthenticated, (req,res) => {
    res.send('<h2><a href="https://github.com/Wanyeki/whipfs#readme"> Payment received ,Go to github</a></h2>')

})

module.exports = router;

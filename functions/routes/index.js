const { Router } = require("express");

const router = Router();


router.use('/user', require('./user.router'));
router.use('/premium', require('./premium.router'))
router.use('/callbacks', require('./callbacks.router'))
router.get('/',(req,res)=>{
    res.send('<h2><a href="https://github.com/Wanyeki/whipfs#readme">Go to github</a></h2>')
})

module.exports = router;
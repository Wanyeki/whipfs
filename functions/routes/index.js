const { Router } = require("express");

const router = Router();

router.use('/user', require('./user.router'));
router.use('/premium', require('./premium.router'))
router.use('/callbacks', require('./callbacks.router'))


module.exports = router;
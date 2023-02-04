const router = require('express').Router();
router.use('/store', require('./store'));

module.exports = router;

const express = require('express');
const router = express.Router();

const controller = require('../controllers/account');

//GET
router.get('/:id', controller.get);

//POST
router.post('/', controller.create);

//PUT
router.put("/:id", controller.update);

//DELETE
router.delete("/:id", controller.deleteAccount);

module.exports = router;
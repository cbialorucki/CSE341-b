const express = require('express');
const router = express.Router();

const controller = require('../controllers/store');

//GET
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getOneProduct);

//POST
router.post('/', controller.listProduct);

//PUT
//DELETE

module.exports = router;
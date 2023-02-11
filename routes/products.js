const express = require('express');
const router = express.Router();

const controller = require('../controllers/products');

//GET
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

//POST
router.post('/', controller.listProduct);

//PUT
router.put("/:id", controller.updateProduct);

//DELETE
router.delete("/:id", controller.deleteProduct);

module.exports = router;
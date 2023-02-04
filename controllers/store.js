const mongoDB = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllProducts = async (req, res, next) => {
   // #swagger.description = 'Returns all the products in the store.'
    const result = await mongoDB.getDb().db().collection('store').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

const getOneProduct = async (req, res, next) => {
  /* #swagger.description = 'Returns one product from the database.'
  #swagger.parameters['id'] = {
        description: 'The ID for the product to retrieve',
        required: 'true',
        type: 'string'
  */
    const productId = new ObjectId(req.params.id);
    const result = await mongoDB.getDb().db().collection('store').find({ _id: productId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
};

const listProduct = async (req, res, next) => {
  /* #swagger.description = 'Stores a product in the database.'
  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Adds a product to the database',
        schema: {
          $title: 'Product Title',
          $qty: 999,
          $description: 'Sample description',
          $price: 9.99,
          $rating: 0.88
        }
  }
  }*/
  const product = {
    title: req.body.title,
    qty: req.body.qty,
    description: req.body.description,
    price: req.body.price,
    rating: req.body.rating
  };
  const response = await mongoDB.getDb().db().collection('store').insertOne(product);
  if (response.acknowledged) 
    res.status(201).json(response);
  else 
    res.status(500).json(response.error || 'An error occurred while listing the product. Please try again.');
};


module.exports = { getAllProducts, getOneProduct, listProduct };
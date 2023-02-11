const db = require('../models');
const Store = db.store;

const getAll = async (req, res) => {
  //  #swagger.description = 'Returns all the product listings in the store.'
  try {
    Store.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'An error occurred while retrieving the  product listings.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOne = async (req, res) => {
  /*  #swagger.description = 'Returns one product listing from the database.'
      #swagger.parameters['id'] = {
        description: 'The ID for the product listing to retrieve',
        required: 'true',
        type: 'string'
  }
  */
  try {
    const id = req.params.id;
    Store.find({ _id: id })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'An error occurred while retrieving the product listing.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

const listProduct = async (req, res) => {
  /*  #swagger.description = 'Stores a product listing in the database.'
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The product listing to add to the database',
        schema: {
          $title: 'Product Title',
          $qty: 999,
          $description: 'Sample description',
          $price: 9.99,
          $rating: 0.88
        }
      }
  }*/
  try {
    const listing = new Store(req.body);
    listing
      .save()
      .then((data) => {
        console.log(data);
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'An error occurred while creating the product listing.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateProduct = async (req, res) => {
  /*  #swagger.description = 'Updates a product listing in the database.'
      #swagger.parameters['id'] = {
        description: 'The ID for the product listing to update',
        required: 'true',
        type: 'string'
      }
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The new product listing information',
        schema: {
          $title: 'Updated Product Title',
          $qty: 1000,
          $description: 'Updated sample description',
          $price: 0.99,
          $rating: 0.99
        }
      }
  }*/
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ message: 'Invalid ID used' });
      return;
    }
    Store.findOne({ _id: id }, function (err, listing) {
      listing.title = req.params.title;
      listing.qty = req.body.qty;
      listing.description = req.body.description;
      listing.price = req.body.price;
      listing.rating = req.body.rating;
      listing.save(function (err) {
        if (err)
          res.status(500).json(err || 'An error occurred while updating the product listing.');
        else
          res.status(204).send();
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteProduct = async (req, res) => {
  /*  #swagger.description = 'Deletes a product listing from the database.'
      #swagger.parameters['id'] = {
        description: 'The ID for the product listing to delete',
        required: 'true',
        type: 'string'
      }
  */
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ message: 'Invalid ID used' });
      return;
    }
    User.deleteOne({ _id: id }, function (err, result) {
      if (err) {
        res.status(500).json(err || 'An error occurred while deleting the product listing.');
      } else {
        res.status(204).send(result);
      }
    });
  } catch (err) {
    res.status(500).json(err || 'Some error occurred while deleting the contact.');
  }
};

module.exports = { getAll, getOne, listProduct, updateProduct, deleteProduct };
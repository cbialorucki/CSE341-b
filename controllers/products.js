const db = require('../models');
const Store = db.store;
const Account = db.account;

const getAll = async (req, res) => {
  /*  #swagger.description = 'Returns all the product listings in the store.'
  #swagger.tags = ['Product Management']
  */
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
      #swagger.tags = ['Product Management']
      #swagger.parameters['id'] = {
        description: 'The ID for the product listing to retrieve',
        required: 'true',
        type: 'string'
  }
  */
  try {
    const id = req.params.id;
    Store.findOne({ _id: id })
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
      #swagger.tags = ['Product Management']
      #swagger.security = [{ "oAuth": [] }]
      #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The product listing to add to the database',
        schema: {
          $title: 'Product Title',
          $qty: 999,
          $shortDesc: 'A short description, usually seen immediately after selecting an item.',
          $description: 'A lengthier description. This would appear below the product listing in most UIs.',
          $price: 9.99,
          $rating: 0.88
        }
      }
  }*/
  try {
    const itemListing = {};
    itemListing.title = req.body.title;
    itemListing.qty = req.body.qty;
    itemListing.shortDesc = req.body.shortDesc;
    itemListing.description = req.body.description;
    itemListing.price = req.body.price;
    itemListing.rating = req.body.rating;
    itemListing.sub = req.oidc.user.sub;
    const listing = new Store(itemListing);
    listing.save()
      .then((data) => {
        console.log(data);
        Account.findOne({sub: req.oidc.user.sub}, function(err, account){
          if(err) res.status(500).send({message: err.message || 'An error occurred while creating the product listing.'});
          if(!account){
            //Create account
            const newAcc = new Account({sub: req.oidc.user.sub, listings: [data._id]});
            newAcc.save().then((dataAccount) => { console.log(dataAccount); })
            .catch((err) => {res.status(500).send('An error ocurred.')});
          }
          else{
            //Store listing in existing account
            account.listings.push(data._id);
            account.save().then((dataAccount) => { console.log(dataAccount); })
            .catch((err) => {res.status(500).send('An error ocurred.')});
          }
        });
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
      #swagger.tags = ['Product Management']
      #swagger.security = [{ "oAuth": [] }]
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
          $shortDesc: 'An updated short description, usually seen immediately after selecting an item.',
          $description: 'An updated lengthier description. This would appear below the product listing in most UIs.',
          $price: 0.99,
          $rating: 0.99
        }
      }
  }*/
  try {
    const id = req.params.id;
    const userId = req.oidc.user.sub;
    if (!id) {
      res.status(400).send({ message: 'Invalid ID used' });
    }
    Store.findOne({ _id: id }, function (err, listing) {
      if(listing.sub != userId){
        res.status(400).send({ message: "You don't have permission to update this listing." });
      }
      else if(!listing){
        res.status(400).send({ message: "This product does not exist." });
      }
      else{
        listing.title = req.body.title;
        listing.qty = req.body.qty;
        listing.shortDesc = req.body.shortDesc;
        listing.description = req.body.description;
        listing.price = req.body.price;
        listing.rating = req.body.rating;
        listing.sub = userId;
        listing.save(function (err) {
          if (err)
            res.status(500).json(err || 'An error occurred while updating the product listing.');
          else
            res.status(204).send();
        });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteProduct = async (req, res) => {
  /*  #swagger.description = 'Deletes a product listing from the database.'
      #swagger.tags = ['Product Management']
      #swagger.security = [{ "oAuth": [] }]
      #swagger.parameters['id'] = {
        description: 'The ID for the product listing to delete',
        required: 'true',
        type: 'string'
      }
  */
  try {
    const id = req.params.id;
    const userId = req.oidc.user.sub;
    if (!id) {
      res.status(400).send({ message: 'Invalid product ID' });
    }
    Store.findOne({ _id: id }, function(err, listing) {
      if(listing.sub != userId){
        res.status(400).send({ message: "You don't have permission to delete this listing." });
      }});
    Store.deleteOne({ _id: id }, function(err, result) {
      if (err) {
        res.status(500).json(err || 'An error occurred while deleting the product listing.');
      } 
      else {
        Account.findOne({sub: req.oidc.user.sub}, function(err, account) {
          let index = account.listings.indexOf(id);
          if (index !== -1) {
            account.listings.splice(index, 1);
          }
          result.save(function (err) {
            if (err)
              res.status(500).json(err || 'An error occurred while removing the product listing from your account.');
          });
        });
        res.status(200).send(result);
      }
    });
  } catch (err) {
    res.status(500).json(err || 'An error occurred while deleting the product listing.');
  }
};

module.exports = { getAll, getOne, listProduct, updateProduct, deleteProduct };
const db = require('../models');
const Account = db.account;

const get = (req, res) => {
  /* #swagger.description = 'Returns account information for one account.'
  #swagger.parameters['id'] = {
        description: 'The ID for the account to retrieve',
        required: 'true',
        type: 'string'
  }
  */
    try {
      const id = req.params.id;
      Account.find({ _id: id })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'An error occurred while retrieving the account.'
          });
        });
    } catch (err) {
      res.status(500).json(err);
    }
};

const create = (req, res) => {
  /* #swagger.description = 'Creates an account.'
  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The account to create.',
        schema: {
          $username: 'exampleUsername',
          $actualName: 'John Q. Adams',
          $email: 'Sample description',
          $password: 'HBADujbu&8o@dyc%bdud^3q8959w4!',
          $items: [],
          $privileges: 1
        }
    }
  }*/
    try {
      if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: 'Invalid username or password.' });
        return;
      }
      const account = new Account(req.body);
      account.save().then((data) => {
          console.log(data);
          res.status(201).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || 'An error occurred while creating the account.'
          });
        });
    } catch (err) {
      res.status(500).json(err);
    }
};

const update = async (req, res) => {
  /* #swagger.description = 'Updates account information.'
  #swagger.parameters['id'] = {
        description: 'The ID for the account to update',
        required: 'true',
        type: 'string'
  }
  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The new account information.',
        schema: {
          $username: 'exampleUsername',
          $actualName: 'John Q. Adams',
          $email: 'Sample description',
          $password: 'HBADujbu&8o@dyc%bdud^3q8959w4!',
          $items: [],
          $privileges: 1
        }
  }
  }*/
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).send({ message: 'Invalid account ID.' });
        return;
      }
      Account.findOne({ _id: id }, function (err, account) {
        account.username = req.params.username;
        account.password = req.body.password;
        account.actualName = req.body.actualName;
        account.email = req.body.email;
        account.items = req.body.items;
        account.privileges = req.body.privileges;
        account.save(function (err) {
          if (err)
            res.status(500).json(err || 'An error occurred while updating the account.');
          else
            res.status(204).send();
        });
      });
    } catch (err) {
      res.status(500).json(err);
    }
};

const deleteAccount = async (req, res) => {
  /* #swagger.description = 'Deletes an account from the database.'
  #swagger.parameters['id'] = {
        description: 'The ID for the account to delete',
        required: 'true',
        type: 'string'
  }
  */
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).send({ message: 'Invalid account ID.' });
        return;
      }
      Account.deleteOne({ _id: id }, function (err, result) {
        if (err) 
          res.status(500).json(err || 'An error occurred while deleting the account.');
        else
          res.status(204).send(result);
      });
    } catch (err) {
      res.status(500).json(err || 'An error occurred while deleting the account.');
    }
};

module.exports = { get, create, update, deleteAccount };
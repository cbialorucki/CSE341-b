const db = require('../models');
const Account = db.account;
const Store = db.store;

const viewAccount = (req, res) => {
  /* #swagger.description = 'Shows details about the current logged in user.'
  #swagger.tags = ['Account Management']
  #swagger.security = [{ "oAuth": [] }]
  */
  try{
    Account.findOne({sub: req.oidc.user.sub}, function(err, account){
      if(err) res.status(500).send({message: err.message || 'An error occurred while showing user details.'});
      if(!account){
        res.status(200).send(JSON.stringify(userDetails));
      }
      else{
        const userDetails = req.oidc.user;
        userDetails.listings = account.listings;
        res.status(200).send(JSON.stringify(userDetails));
      }
    });
  }
  catch (err){
    res.status(500).json(err);
  }
}

const deleteAccount = async (req, res) => {
  /* #swagger.description = 'Deletes the logged in user from the database.'
  #swagger.tags = ['Account Management']
  #swagger.security = [{ "oAuth": [] }]
  */
    try {
      Account.findOne({sub: req.oidc.user.sub}, function(err, account){
        if(err) res.status(500).send({message: err.message || 'An error occurred while showing user details.'});
        if(!account){
          //Empty accounts have no product listings or entries in the DB, just do nothing.
          res.status(200).send(account);
        }
        else{
          account.listings.forEach(listing => {
            Store.deleteOne({ _id: listing }, function (err, result) {
              if (err) {
                res.status(500).json(err || 'An error occurred while deleting the product listings for this account.');
              } else {
                console.log(result);
                account.listings.pop();
              }
            });
          });
        }
      });
      Account.deleteOne({ sub: req.oidc.user.sub }, function (err, result) {
        if (err) 
          res.status(500).json(err || 'An error occurred while deleting the account.');
        else
          res.status(200).send(result);
      });
    } catch (err) {
      res.status(500).json(err || 'An error occurred while deleting the account.');
    }
};

module.exports = { viewAccount, deleteAccount };
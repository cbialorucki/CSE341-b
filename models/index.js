const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_DB_CONNECTION_URI;
db.account = require('./account.js')(mongoose);
db.store = require('./product.js')(mongoose);

module.exports = db;
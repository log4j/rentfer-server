var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user.js');
require('./group.js');
require('./pay.js');
require('./visitor.js');
require('./apartment.js');
require('./order.js');
require('./market.js');
require('./message.js');
require('./tip.js');
require('./favorite.js');


exports.User = mongoose.model('User');
exports.Group = mongoose.model('Group');
exports.Pay = mongoose.model('Pay');
exports.Visitor = mongoose.model('Visitor');
exports.Apartment = mongoose.model('Apartment');
exports.Market = mongoose.model('Market');
exports.Message = mongoose.model('Message');
exports.Tip = mongoose.model('Tip');
exports.Favorite = mongoose.model('Favorite');
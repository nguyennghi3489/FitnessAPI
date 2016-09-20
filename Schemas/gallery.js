///User Model 
///Make sure the connection is opened
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({
  imageUrl:  String,
  userId: String,
  temp: String,
  type: String,
  feedId: String
})
var model = mongoose.model('Gallery', modelSchema);

module.exports = model;
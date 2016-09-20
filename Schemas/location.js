var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({
  xaddress: String,
  country:  String,
  locality: String,
  subLocality:   String,
  administrativeArea: String,
  lat : Number,
  lng : Number
}).index({country: 1, lat:1, lng:1, address: 1},{unique:true});
var model = mongoose.model('Location', modelSchema);

module.exports = model; 
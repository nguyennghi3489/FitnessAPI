///User Model 
var mongoose = require('mongoose');
var textSearch = require("mongoose-text-search");
var Schema = mongoose.Schema;

var activitySchema = new Schema({
  title: String,
  type:   Number,
  personNumber: Number,
  xDescription: String,
  level : Number,
  date :Date,
  datetime :Date,
  dateGMT :Date,
  dateISO :Date,
  trainer :String,
  locationType :Number,
  specificLocation : String,
  status : Number,
  addressName : String,
  location : { type: Schema.Types.ObjectId, ref: 'Location' },
  owner:  { type: Schema.Types.ObjectId, ref: 'User' }
}).index({"location.country": 1, "location.locality": 1, "location.lat":1, "location.lng":1});

var activity = mongoose.model('Activity', activitySchema);

module.exports = activity;

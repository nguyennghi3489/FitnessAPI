///User Model 
var mongoose = require('mongoose');
var textSearch = require("mongoose-text-search");
var Schema = mongoose.Schema;

var bookingSchema = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'User' },
  trainerId:  { type: Schema.Types.ObjectId, ref: 'User' },
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' },
  message: String,
  status:   Number,
  date :Date
}).index({userId: 1,activity:1},{ unique: true });

var booking = mongoose.model('Booking', bookingSchema);

module.exports = booking;

///User Model 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedSchema = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,
  status:   Number,
  date :Date,
}).index({"userId": 1});;

var booking = mongoose.model('Booking', bookingSchema);

module.exports = booking;

///User Model 
var mongoose = require('mongoose');
var textSearch = require("mongoose-text-search");
var Schema = mongoose.Schema;

var bookingSchema = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'User' },
  trainerId:  { type: Schema.Types.ObjectId, ref: 'User' },
  activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
  status:   Number,
  date :Date
}).index({userId: 1,activityId:1},{ unique: true });

var booking = mongoose.model('Booking', bookingSchema);

module.exports = booking;

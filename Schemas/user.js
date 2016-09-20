///User Model 
///Make sure the connection is opened
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, required: true, index: true, unique: true },
  //Basic
  firstname: String,
  lastname:   String,
  fullname: String,
  gender: String,
  nationality: String,  
  password: String,
  //Skill
  quote: String,
  xDescription: String,
  major: [String],
  //Image
  baseImageUrl: String,
  //System
  type: Number,
  admin:Boolean,
  isActive:String,
  
  gallery:[{ type: Schema.Types.ObjectId, ref: 'Gallery' }]
},{
    timestamps: true
});
var user = mongoose.model('User', userSchema);

module.exports = user;
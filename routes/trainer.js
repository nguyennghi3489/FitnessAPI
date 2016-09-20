var Gallery = require('../Schemas/gallery.js');
var User = require('../Schemas/user.js');
var jwt    = require('jsonwebtoken');
var config = require('../config.js');
var Utilites = require('../utilities.js');
var Booking = require('../Schemas/booking.js');
module.exports = function(app) {
	app.get('/gallery', function(request, response) {
		Gallery.find({"userId": request.query.id}, function(err, galleries) {
	    if (!err){
	        console.log(galleries);
	        response.send(galleries);
	    } else {throw err;}
	  });
	});

	app.get('/trainer', function(request, response) {
	  User.find({"type":"1"}, function(err, trainers) {
	    if (!err){ 
	        response.send(trainers);
	    } else {throw err;}
	  });
	});

	app.get('/checkEmailExist', function(request,response) {
	  User.find({"email":request.query.email,"type":1}, function(err, trainers) {
	    if (!err){ 
	    	console.log(trainers.length);
	    	if(trainers.length > 0){
	    		response.send({code:11000,success:false});
	    	}
	        else{
	        	response.send({success:true,trainers:trainers});
	        }
	        
	    } else {

	    	throw err;
	    	
	    }
	  });
	});

	app.get('/trainer/bookingList', function(request, response) {
      console.log(request.query);
      Booking.find({"trainerId":request.query.userId})
      .populate('activityId')
      .populate('userId')
      .exec(function (err, story) {
        if (!err){ 
            response.send(story);
        } else {throw err;}
      });
    });
	
	app.put('/trainer', function(request, response) {
	  var data = {};
	  console.log(request.body);
	  if(request.body.description){
	    data["description"] = request.body.description;
	  }
	  if(request.body.quote){
	    data["quote"] = request.body.quote;
	  }
	  if(request.body.major){
	    data["major"] = request.body.major;
	  }
	  if(request.body.baseImageUrl){
	    data["baseImageUrl"] = request.body.baseImageUrl;
	  }
	  if(request.body.gender){
	    data["gender"] = request.body.gender;
	  }
	  if(request.body.nationality){
	    data["nationality"] = request.body.nationality;
	  }

	  if(request.body.isActive){
	  	data["isActive"] = 1;	
	  	console.log("ID:");
	  	console.log(request.body.Id);
	  	User.findOne({_id:request.body.Id},function(err,user){
	  		console.log(user);
	  		console.log("_________");
	      	var mailToken = jwt.sign({email:user.email}, config.secret, {
		      expiresIn: 100 // expires in 24 hours
		    });
	      	
	    })
	  }

	  var conditions = { _id: request.body.Id }
	  , update = { $set: data}

	  User.findOneAndUpdate(conditions, update, callback);

	  function callback (err, numAffected) {
	    // numAffected is the number of updated documents
	    if(err){
	      response.send({"success":false});
	    }
	  }
	  response.send({"success":true});
	});

}
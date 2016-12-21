var Gallery = require('../Schemas/gallery.js');
var User = require('../Schemas/user.js');
var UserModel = require('../Models/user.js')

var bcrypt = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');
var config = require('../config.js');
var Utilites = require('../utilities.js');
var Booking = require('../Schemas/booking.js');
var promise = require('promise');

module.exports = function(app) {
	app.get('/gallery', function(request, response) {
		Gallery.find({"userId": request.query.id}, function(err, galleries) {
	    if (!err){
	        console.log(galleries);
	        response.send(galleries);
	    } else {throw err;}
	  });
	});

	app.get('activity/coachId', function(request, response) {
	  User.find({"type":"1"}, function(err, trainers) {
	    if (!err){ 
	        response.send(trainers);
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

	app.get('/trainerinfo', function(request, response) {
	  User.findOne({"_id":request.query.id}, function(err, trainers) {
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
      .populate('activity')
      .populate('userId')
      .exec(function (err, story) {
        if (!err){ 
            response.send(story);
        } else {throw err;}
      });
    });
	
	app.put('/password', function(request, response) {
	  var data = {};
	  // var user = UserModel.createForUpdate(request.body);
	  console.log(request.body);
	  var p2 = new Promise(function(resolve, reject) {
	  	User.findOne({_id:request.body.userId},function(err,user){
		  	console.log(user);
			if(!bcrypt.compareSync(request.body.oldpassword, user.password)){
			  	resolve(false);
			  	console.log("HERE Flase");
			}
			else{
				resolve(true);
				console.log("HERE true");
			}
		});
	  });
	  p2.then(function(value){
	  	if(value){
	  		console.log("WHY THERE");
	  		var conditions = { _id: request.body.userId }
			  , update = { $set: {"password":bcrypt.hashSync(request.body.newpassword)}}
			User.findOneAndUpdate(conditions, update, callback);

			function callback (err, numAffected) {
			    // numAffected is the number of updated documents
				if(err){
				  response.send({"success":false});
				}
			}
			response.send({"success":true});
	  	}
	  	else{
	  		response.send({"success":false,"error":"Wrong password"});
	  	}
	  })
	  
	});

	app.put('/trainer', function(request, response) {
	  var data = {};
	  console.log(request.body);
	  var user = UserModel.createForUpdate(request.body);
	  console.log(user);
	  
	  // if(request.body.isActive){
	  // 	data["isActive"] = 1;	
	  // 	console.log("ID:");
	  // 	console.log(request.body.Id);
	  // 	User.findOne({_id:request.body.Id},function(err,user){
	  // 		console.log(user);
	  // 		console.log("_________");
	  //     	var mailToken = jwt.sign({email:user.email}, config.secret, {
		 //      expiresIn: 100 // expires in 24 hours
		 //    });
	      	
	  //   })
	  // }

	  var conditions = { _id: request.body.userId }
	  , update = { $set: user}

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
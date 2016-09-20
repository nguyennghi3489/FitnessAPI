var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var jwt    = require('jsonwebtoken');
var config = require('../config.js');
var User = require('../Schemas/user.js');

module.exports = function(app) {
	app.get('/mail', function(request, response) {

		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport('smtps://nguyennghi3489@gmail.com:03041989@smtp.gmail.com');

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: '<nguyennghi3489@gmail.com>', // sender address
		    to: 'canhtung3107@gmail.com', // list of receivers
		    subject: 'Hello ✔', // Subject line
		    text: 'Hello world 🐴', // plaintext body
		    html: '<b>Hello world 🐴</b>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
	});
	app.get('/confirmMail', function(request, response) {
		jwt.verify(request.query['token'], config.secret, function(err, decoded) {  
	        if (err) {
	          return response.json({ success: false, message: 'Failed to authenticate token.' });    
	        } else {
	        	var decoded = jwt.decode(request.query['token'], {complete: true});
	          // if everything is good, save to request for use in other routes
	           var conditions = { email: decoded["payload"].email }
	  			, update = { $set: {isActive:2}}
	          User.findOneAndUpdate(conditions, update, callback);

			  function callback (err, numAffected) {
			    // numAffected is the number of updated documents
			    if(err){
			      response.send({"success":false});
			    }
			  }
			  response.writeHead(302, {
				  'Location': 'http://localhost:8000'
				  //add other headers here...
			  });
	          response.end();
	        }
	      });
	});
}
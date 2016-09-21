var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    sendMail:function(email, token){
		var transporter = nodemailer.createTransport('smtps://nguyennghi3489@gmail.com:03041989@smtp.gmail.com');
			console.log(email);
			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: '<nguyennghi3489@gmail.com>', // sender address
			    //to: email, // list of receivers
			    to : 'nguyennghi22222@gmail.com',
			    subject: 'Hello ✔', // Subject line
			    text: 'Hello world 🐴', // plaintext body
			    html: "<b>Hello world 🐴</b>"+ "<a href='http://52.40.15.203:3000/api/confirmMail?token="+ token + "' />Click Here to Active Your Account</a>" // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			});
	}
};

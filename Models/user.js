var bcrypt = require('bcrypt-nodejs');

module.exports = { 
	create : function(object){
		var data = {};
		//Basic
		data.firstname = object.firstname;
		data.lastname = object.lastname;
		data.fullname = data.firstname + " " + data.lastname;
		data.password = object.password;
		data.nationality = object.nationality;
		data.email = object.email;
		data.gender = object.gender;
		//Skills
		data.quotes = object.quotes;
		data.xDescription = object.description;
		data.major = object.major;
		//System
		data.password = bcrypt.hashSync(object.password);
		data.isActive = false;
		data.isAdmin = false;
		data.type = 1;
		return data;
	}	
}
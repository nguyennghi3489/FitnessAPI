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
		data.quote = object.quote;
		data.xDescription = object.description;
		data.major = object.major;
		//System
		data.password = bcrypt.hashSync(object.password);
		data.isActive = false;
		data.isAdmin = false;
		data.type = 1;
		return data;
	},
	createForUpdate: function(object){
		var data = {};
		data.firstname = object.firstname;
		data.lastname = object.lastname;
		data.fullname = data.firstname + " " + data.lastname;
		data.quote = object.quote;
		data.xDescription = object.description;
		return data;
	}
}
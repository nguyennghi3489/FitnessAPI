module.exports = { 
	create : function(object){

		var data = {};
		//Basic
		data.title = object.title;
		data.type = object.activityType;
		data.level = object.activityLevel;
		data.xDescription = object.description;
		data.datetime = object.datetime;
		data.date = object.date;
		console.log("CREATE ACTIVITY");
		console.log(data);
		return data;
	}	
}
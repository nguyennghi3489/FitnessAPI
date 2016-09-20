module.exports = { 
	create : function(object){
		var data = {};
		//Basic
		data.country = object.country;
		data.subLocality = object.subLocality;
		data.locality = object.locality;
		data.lat = object.lat;
		data.lng = object.lng;
		data.xaddress = object.address;
		data.administrativeArea = object.administrative_area_level_1;

		return data;
	}	
}
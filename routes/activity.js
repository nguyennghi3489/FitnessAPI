var ActivitySchema = require('../Schemas/activity.js');
var LocationSchema = require('../Schemas/location.js');

var Booking = require('../Schemas/booking.js');
var User = require('../Schemas/user.js');
var EventEmitter = require('events').EventEmitter;

var ActiviyModel = require('../Models/activity.js');
var LocationModel = require('../Models/location.js');

var onesignal = require('node-opensignal-api');
var onesignal_client = onesignal.createClient();
var Promise = require('promise');
var logger = new EventEmitter();

var restApiKey = 'YTBkM2Y4ZjQtMTVkNy00ODhlLTg4NGQtMWViZWYxYzI5YzM3';

module.exports = function(app, clients) {
    app.get('/activity', function(request, response) {
      var condition = {};
      if(request.query.userId){
        condition["owner"] = request.query.userId;
      }
      ActivitySchema.find(condition, function(err, activities) {
        if (!err){ 
            response.send(activities);
        } else {throw err;}
      });
    });
    app.post('/activity/coachId', function(request, response) {
      console.log("SHOULD GO HERE");
        ActivitySchema.find({"owner":request.body.coachId})
        .populate('owner')
        .populate('location')
        .exec(function (err, activities) {
          if (!err){ 
            response.send(activities);
          } else {throw err;}
        });
    });
    app.post('/activity', function(request, response) {
      if (!request.body) return response.sendStatus(400);
      var locationId;        
      var p2 = new Promise(function(resolve, reject) {
        console.log(request.body.location);
        if(typeof request.body.location != "undefined"){
          console.log("JOIN HERE");
          var locationData = LocationModel.create(request.body.location);
          LocationSchema.findOne(locationData,function(err, location){
            if(location){
              // console.log(location);
              resolve(location._id);
            }
            else{
              var newLocation = new LocationSchema(locationData);
              newLocation.save(function (err, new_location){
                if(err){
                  console.log("FAIL WHEN CREATE LOCATION?");
                  reject(err);
                }
                // console.log(new_location);
                resolve(new_location._id);
              });
            }
          });
        }
        else{
          resolve(false);
        }
      });

      p2.then(function(value) {
        var activityData = ActiviyModel.create(request.body);
        console.log("DOES IT HAVE LOCATION?");
        console.log(value);
        activityData.owner = request.body.userId;
        if(value){
          activityData.location = value;  
        }
        activity = new ActivitySchema(activityData);
        console.log("prepare--------------------------");
        activity.save(function (err, new_activity) {
          if (err) return console.log(err);
          console.log("success--------------------------");
          response.send("true");
        });
      });
    });

    app.post('/activity/search',function(request, response){
      var dateInput = new Date(request.body.date);
      var condition = {};
      console.log("DATE INPUT HERE-----------------------------");
      console.log(request.body);
      console.log(dateInput);
      if(request.body.date){
        condition["date"] = {"$eq": dateInput };
      }
      if(request.body.type && request.body.type != "*"){
        condition["type"] = parseInt(request.body.type);
      }
      if(request.body.trainer){
        condition["trainer"] = { $regex: new RegExp("^" + request.body.trainer.toLowerCase(), "i") } 
      }
      if(request.body.country){
        condition["location.country"] = request.body.country;
      }
      if(request.body.maxLat){
        condition["location.lat"] = {"$gte":parseFloat(request.body.minLat),"$lte":parseFloat(request.body.maxLat)};
      }
      if(request.body.maxLng){
        condition["location.lng"] = {"$gte":parseFloat(request.body.minLng),"$lte":parseFloat(request.body.maxLng)};
      }
      ActivitySchema.find(condition).
      populate('owner').
      populate('location').
      limit(10).exec(function(err, person){
        response.send(person);
        // Promise.resolve(person).then(function(activity){
        //   addInformationForConnect(activity)
        // }).
        // then(function(activity){
        //   response.send(activity);
        // })
      });
    });
    
    app.get('/activity/get', function(request, response) {
      if(request.query.userId){
        Activity.find({"userId":{$ne: request.query.userId}}).populate('userId').exec(function (err, activities) {
          if (!err){ 
              response.send(activities);
          } else {throw err;}
        });
      }
      else{
        Activity.findOne({_id:request.query.id}).populate('userId').exec(function (err, activities) {
          if (!err){ 
              response.send(activities);
          } else {throw err;}
        });
      }
    });

    app.post('/activity/register', function(request, response){
      var data = {};
      console.log(request.body);
      data.userId = request.body.userId;
      data.trainerId = request.body.trainerId;
      data.activity = request.body.activity;
      data.message = request.body.message;
      data.link = request.body.link;
      data.status = 0;
      data.date = request.body.date;

      console.log(data);
      isRegisted(data.userId, data.trainerId, data.activity).then(function(isRegisted) {
        if(isRegisted){
          handleError("{code:11000}",response);
        }
        else{
          booking = new Booking(data);
          booking.save(function (err, booking) {
            if(booking !== undefined){
              clients.emit('request',data);  
              response.send({"success":true});
            }
            if (err) return handleError(err,response);
          })
        }
      });
    });

    app.post('/activity/approve', function(request, response){
      console.log("APPROVE");
      console.log(request.body);
      var conditions = {};
      
      // conditions.trainerId = request.body.trainerId;
      conditions._id = request.body.id;
      var update = { $set: {status:1}}
      Booking.findOneAndUpdate(conditions, update, function(err,item){
        if(typeof item !== undefined){
          console.log(item);
          var params = {
              app_id: '4e3a4d65-55c7-457d-9882-1bddb3a8ff7c',
              contents: {
                  'en': 'Notification body',
                  'es': 'Cuerpo de la notificación'
              },
              tags: [{ "key": "userId", "relation": "=", "value": item.userId}]
          };

          onesignal_client.notifications.create(restApiKey, params, function (err, response) {
              if (err) {
                console.log('Encountered error', err);
              } else {
                
                console.log(response);
              }
          });
          response.send({"success":true});
        }
        if(err){
          console.log("OR FAIL");
          response.send({"success":false});
        }
      });
    });

    app.get('/activity/registed', function(request, response) {
      console.log(request.query);
      Booking.find({"userId":request.query.userId})
      .populate('activity')
      .exec(function (err, story) {
        if (!err){ 
            response.send(story);
        } else {throw err;}
      });
    });

    app.post('/activity/session', function(request, response) {
      console.log("SESSION");
      console.log(request.body);
      Booking.find({"userId":request.body.userId})
      .lean()
      .populate({
        path: 'activity',
        populate: [{
          path: 'location',
          model: 'Location'
        },
        {
          path: 'owner',
          model: 'User'
        }]
      })
      .exec(function (err, story) {
        if (!err){ 
            response.send(story);
        } else {throw err;}
      });
    });

    app.post('/activity/statisticSession', function(request, response) {
      console.log("SESSION");
      console.log(request.body);
      Booking.aggregate(
      [
          // Grouping pipeline
          { "$group": { 
              "_id": '$userId', 
              "recommendCount": { "$sum": 1 }
          }},
          // Sorting pipeline
          { "$sort": { "recommendCount": -1 } },
          // Optionally limit results
          { "$limit": 5 }
      ],function (err, story) {
        if (!err){ 
            response.send(story);
        } else {throw err;}
      });
    });

    function isRegisted(userId, trainerId, activity){
      var data = {};
      data.userId = userId;
      data.trainerId = trainerId;
      data.activity = activity;
      console.log("REGISTER");
      console.log(data);
      return Booking.find(data).then(function(item){
        console.log(item);
        if(item.length > 0){
          console.log("EXISTED");
          return Promise.resolve(true);
        }
        else{
          return Promise.resolve(false);
        }
      })

    }
    function handleError(error, response){
      console.log(error);
      response.json({
          success: false,
          code: error.code
      });
    }
}
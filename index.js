var express = require('express');
var app = express();
var fs = require("fs");
var path = require('path');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan    = require('morgan');
var Schema = mongoose.Schema;
var url = 'mongodb://52.43.201.76:27017/test';
var jwt    = require('jsonwebtoken');
var config = require('./config.js');
var bcrypt = require('bcrypt-nodejs');
var Utilites = require('./utilities.js');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cors = require('cors');

//Connect Mongo
mongoose.connect(url, function(err, conn){
  if(err)
    console.error('error: ', err.message);
  else
    console.log('holysheet');
});

app.set('superSecret', config.secret);
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

///Set StaticPath 
app.use("/app", express.static(path.join(__dirname, 'public')));
app.use("/image", express.static(path.join(__dirname, 'public/upload')));

//Socket
var clients = io.on('connection',function(socket){
    socket.on('a',function(data){
      console.log(data);
    });
});

///Prepare ModelSchema
var UserSchema = require('./Schemas/user.js');
var Activity = require('./Schemas/activity.js');
var Location = require('./Schemas/location.js');
var Gallery = require('./Schemas/gallery.js');
var Booking = require('./Schemas/booking.js');

UserSchema.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});
mongoose.set('debug', true);

///Prepare Model 
var UserModel = require('./Models/user.js');

///Set Route
var apiRoutes = express.Router();  
require('./routes/feed')(apiRoutes);
require('./routes/activity')(apiRoutes, clients);
require('./routes/trainer')(apiRoutes);
require('./routes/mail')(apiRoutes);

///Control Request Data
app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/successAuthentication', function(request, response) {
    response.sendFile(path.join(__dirname + '/successAuthentication.html'));
});
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/signup', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/manage/form', function(request, response) {
  console.log(__dirname);
    response.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/login', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/manage/activity', function(request, response) {
  response.sendFile(path.join(__dirname + '/index.html'));
});

apiRoutes.post('/user/signup', function(request, response) {
  if (!request.body) return res.sendStatus(400);
  var userData = UserModel.create(request.body);
  var user = new UserSchema(userData);

  user.save(function (err) {
    if (err) return handleError(err, response);
    // saved!
    var token = jwt.sign(user, app.get('superSecret'), {
      expiresIn: 100 // expires in 24 hours
    });
    var mailToken = jwt.sign({email:user.email}, app.get('superSecret'), {
      expiresIn: 100 // expires in 24 hours
    }); 
    Utilites.sendMail(user.email, mailToken);
    response.json({
      success: true,
      message: 'Enjoy your token!',
      userId : user._id,
      isActive: 0,
      fullName: user.firstname + " " + user.lastname,
      token: token
    });
  })
});

apiRoutes.post('/user/fbsignup', function(request, response) {
  if (!request.body) return rUserSchemaUserSchemaes.sendStatus(400);
  console.log(request.body);
  var data = {};
  data.email = request.body.email;
  data.link = request.body.link;
  data.fullname = request.body.fullname;
  data.type = parseInt(request.body.userType);
  data.baseImageUrl = request.body.avatar;
  user = new UserSchema(data);
  user.save(function (err) {
    if (err) return handleFBError(err, response, data.email);
    // saved!
    var token = jwt.sign(user, app.get('superSecret'), {
      expiresIn: 100 // expires in 24 hours
    });
    response.json({
      success: true,
      message: 'Enjoy your token!',
      userId : user._id,
      fullName: user.firstname + " " + user.lastname,
      token: token
    });
  })
});

function handleError(error, response){
  console.log(error);
  response.json({
      success: false,
      code: error.code
  });
}

function handleFBError(error, response, email){
  var token = jwt.sign(user, app.get('superSecret'), {
    expiresIn: 100 // expires in 24 hours
  });
  UserSchema.findOne({email:email},function(err,user){
    response.json({
      success: false,
      userId: user._id,
      token: token,
      code: error.code
    });
  });
  
}

apiRoutes.post('/authenticate', function(request, response){
  UserSchema.findOne({email: request.body.email},
    function(err, user){
      if (err) throw err;
      if (!user) {
        response.json({ success: false, message: 'Authentication failed. User not found.' });
      } 
      else if (user) {
        if (!bcrypt.compareSync(request.body.password, user.password)) {
          response.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn: 900 // expires in 24 hours
          });

          Booking.find({'userId':user._id},{'_id': 0,'activityId':1},function(err,bookings){
            if (err) throw err;
            if (bookings) {
              response.json({
                success: true,
                message: 'Enjoy your token!',
                userId : user._id,
                isActive: user.isActive,
                bookings: bookings,
                fullName: user.firstname + " " + user.lastname,
                token: token
              });
            }
            else{
              response.json({
                success: true,
                message: 'Enjoy your token!',
                userId : user._id,
                isActive: user.isActive,
                bookings: [],
                fullName: user.firstname + " " + user.lastname,
                token: token
              });
            }
          })  
        }
      }
  });
})

apiRoutes.post('/avatarUpload', function(req,res){
  console.log(req.body);
  var data = req.body.data;
  var filename = req.body.filename;
  var filePart = filename.split(".");
  var outfile = __dirname + '/public/upload/' + req.body.id + ".png"; 
  var base64Data = data.replace(/^data:image\/png;base64,/, "");

  require("fs").writeFile(outfile, base64Data, 'base64', function(err) {
    console.log(err);
  });
})

apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var bodyToken;
  if(req.body){
    bodyToken = req.body.token;
  }
    var token = bodyToken || req.query.token || req.headers['x-access-token'];
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {  
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
    }
  else{
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// Add headers
app.use(cors());

///Run App
app.use('/api', apiRoutes);
server.listen(port);
console.log('Magic happens on port ' + port);


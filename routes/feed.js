var Gallery = require('../Schemas/gallery.js');
var User = require('../Schemas/user.js');
module.exports = function(app) {
  app.get('/feedImage', function(request, response) {
    Gallery.find({"userId": request.query.id}, function(err, galleries) {
      if (!err){
          console.log(galleries);
          response.send(galleries);
      } else {throw err;}
    });
  });

  app.post('/feed', function(request, response) {
      if (!request.body) return response.sendStatus(400);
      var data = {};
      data.userId = request.body.userId;
      data.description = request.body.description;

      feed = new Feed(data);
      feed.save(function (err, new_activity) {
        if (err) return console.log(err);
        // saved!
        response.send("true");
      })
    });
}
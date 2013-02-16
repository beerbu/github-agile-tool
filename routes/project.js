
/*
 * project controller
 */
var https = require('https');
var mongoose = require('mongoose');
mongoose.connect('mongodb://beerbu:kuzu@linus.mongohq.com:10053/github-ajile-tool');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Project = new Schema({
    id        : ObjectId,
    name      : String
});

 // You would fetch your user from the db
exports.loadProject = function(req, res, next) {
  var proj = proj[req.params.name];
  if (proj) {
    req.proj = proj;
    next();
  }
  else {
    next(new Error('Failed to load project ' + req.params.name));
  }
};

exports.index = function(req, res) {
  res.send("respond with a resource");
};

exports.new = function(req, res) {
    var user = req.session.passport.user.username;
    var getAllUserRepos = {
        host: 'api.github.com',
        port: '443',
        path: '/users/' + user + '/repos',
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var request = https.request(getAllUserRepos, function(result) {
        var output = '';
        result.setEncoding('utf8');

        result.on('data', function (chunk) {
            output += chunk;
        });

        result.on('end', function() {
            var repos = JSON.parse(output);
            res.render('project-index', { 'repos' : repos });
        });
    });

    request.on('error', function(err) {
        console.log(err);
        //res.send('error: ' + err.message);
    });

    request.end();
    // res.send("respond with a resource");
};

exports.create = function(req, res) {
  var name = req.body.repo;
  res.render('project-created', { 'name' : name });
};

exports.detail = function(req, res) {
  res.send("respond with a resource");
};
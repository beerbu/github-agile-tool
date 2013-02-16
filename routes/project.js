
/*
 * project controller
 */
var http = require('http');
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
    // TODO
    var user = req.session.passport.user;
    var getAllUserRepos = {
        host: 'api.github.com',
        port: '80',
        path: '/users/' + user + '/repos',
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var request = http.request(getAllUserRepos, function(result) {
        var output = '';
        result.setEncoding('utf8');

        result.on('data', function (chunk) {
            output += chunk;
        });

        result.on('end', function() {
            var repos = JSON.parse(output);
            res(resulst.statusCode, repos);
            res.render('index', { 'repos' : repos });
        });
    });

    reqest.on('error', function(err) {
        console.log(err);
        //res.send('error: ' + err.message);
    });

    reqest.end();
    // res.send("respond with a resource");
};

exports.create = function(req, res) {
  res.send("respond with a resource");
};

exports.detail = function(req, res) {
  res.send("respond with a resource");
};
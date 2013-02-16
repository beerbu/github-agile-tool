
/*
 * project controller
 */
var https = require('https');
var Project = require('../models/project.js');

exports.index = function(req, res) {
  var username = req.session.passport.user.username;
  Project.find({'username': username}, function(err, projects) {
    if (err) console.log(err);

    res.render('project-index', { 'projects' : projects });
  });
};

exports.new = function(req, res) {
    var username = req.session.passport.user.username;
    var getAllUserRepos = {
        host: 'api.github.com',
        port: '443',
        path: '/users/' + username + '/repos',
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
            res.render('project-new', { 'repos' : repos });
        });
    });

    request.on('error', function(err) {
        console.log(err);
    });

    request.end();
};

exports.create = function(req, res) {
  var username = req.session.passport.user.username;
  var reponame = req.body.reponame;

  Project.find({'username': username, 'reponame': reponame}, function(err, projects) {
    if (err) console.log(err);

    if (projects.length === 0) {
      var project = new Project({'username': username, 'reponame': reponame});
      project.save(function(err) {
          console.log(err);
      });

      res.render('project-created', { 'name' : reponame });
    }
    else {
      res.redirect('/projects');
    }
  });
};

exports.detail = function(req, res) {
  res.send("respond with a resource");
};
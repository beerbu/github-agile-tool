
/*
 * kanban controller
 */
var https = require('https');
var v = require('valentine');
var async = require('async');
var Kanban = require('../models/kanban.js');
var Pbl = require('../models/pbl.js');
var session = require('passport').session;

function callGithubAPI(path, accessToken, callback) {
    var options = {
        host: 'api.github.com',
        port: '443',
        path: path,
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + accessToken
        }
    };

    var request = https.request(options, function(result) {
        var output = '';
        result.setEncoding('utf8');

        result.on('data', function (chunk) {
            output += chunk;
        });

        result.on('end', function() {
            var obj = JSON.parse(output);
            callback(null, obj);
        });
    });

    request.on('error', function(err) {
        callback(err);
    });

    request.end();
}

exports.index = function(req, res) {
  var username = req.session.passport.user.username;
  var accessToken = req.session.accessToken;
  var orgname = req.params.orgname;
  var reponame = req.params.reponame;

  console.log('orgname = ' + orgname);
  console.log('reponame = ' + reponame);

  v.waterfall([
    // mongoからkanban一覧を出す
    function (callback) {
      Kanban.find({'orgname': orgname, 'reponame': reponame}, function(err, kanbans) {
        if (err) callback(err);

        callback(null, kanbans);
      });
    },
    // カンバン一覧のissueidからissue情報を撮る
    function (kanbans, callback) {
      callback(null, kanbans,
        v(kanbans).chain().map(function(kanban) {
          console.log('issueid = ' + kanban.issueid);
          Pbl.find({'username': orgname, 'reponame': reponame, 'issueId': {$in: kanban.issueid}}, function(err, pbls) {
            return {'username': kanban.username, 'pbls': pbls};
          });
        }).flatten().value()
      );
    }
  ], function(err, kanbans, pbls) {
    if (err) console.log(err);

    console.log('kanbans = ' + kanbans);
    console.log('pbls = ');
    console.log(pbls);
    for (var i = 0; i < kanbans.length; i++) {
      var issues = new Array();
      for (var j = 0; j < pbls.length; j++) {
        if (pbls[j] && kanbans[i].username === pbls[j].username) {
          issues.push(pbls[j].pbls);
        }
      }
      kanbans[i].issues = issues;
    }
    res.render('kanban-index', { 'kanbans': kanbans, 'login': req.session.passport, 'title': 'カンバン一覧'});
  });
};

exports.new = function(req, res) {
  var username = req.session.passport.user.username;
  var accessToken = req.session.accessToken;
  var orgname = req.params.user;
  var reponame = req.params.project;

  var branchname = 'master';
  var path = '/repos/' + orgname + '/' + reponame + '/git/refs/heads/' + branchname;

  // issue一覧
  v.waterfall([
    function (callback) {
    },
    function (callback) {
      callGithubAPI(path, accessToken, callback);
    },
  ], function (err, results) {
    if (err) console.log('err = ' + err);
    console.log('result = ' + results);
  });
};


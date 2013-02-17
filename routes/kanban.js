
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
function postGithubAPI(path, data, accessToken, callback) {
  var postStr = JSON.stringify(data);
  var options = {
    host: 'api.github.com',
    port: '443',
    path: path,
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postStr.length,
      'Authorization': 'bearer ' + accessToken
      }
  };

  var request = https.request(options, function(response) {
    var responseString = '';
    response.setEncoding('utf8');

    response.on('data', function (chunk) {
      responseString += chunk;
    });

    response.on('end', function() {
      var obj = JSON.parse(responseString);
      callback(null, obj);
    });
  });

  request.on('error', function(err) {
    callback(err);
  });

  request.write(postStr);
  request.end();
}

exports.index = function(req, res) {
  var username = req.session.passport.user.username;
  var accessToken = req.session.accessToken;
  var orgname = req.params.orgname;
  var reponame = req.params.reponame;

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
      var list = new Array();
      var count = 0;
      function reduce(result) {
        count++;
        if (result.pbls.length) {
          list.push(result);
        }

        if (count === kanbans.length) {
          callback(null, kanbans, list);
        }
      }

      for (var i = 0; i < kanbans.length; i++) {
        var kanban = kanbans[i];
        var condition = {'username': orgname, 'reponame': reponame, 'issueId': {$in: kanban.issueid}};
        Pbl.find(condition, function(err, pbls) {
          if (err) console.log(err);

          var result = {'username': kanban.username, 'pbls': pbls};
          reduce(result);
        });
      }
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
  var orgname = req.params.orgname;
  var reponame = req.params.reponame;

  var branchname = 'master';
  var path = '/repos/' + orgname + '/' + reponame + '/git/refs/heads/' + branchname;


  // TODO! this is mock
  var pbls = new Array({'orgname': orgname, 'reponame': reponame, 'username': username, 'issueid': 666, 'issuetitle': 'スタブissue'});
  res.render('kanban-new', {'pbls': pbls, 'orgname': orgname, 'reponame': reponame, 'branchname': branchname});
};

exports.create = function(req, res) {
  var username = req.session.passport.user.username;
  var accessToken = req.session.accessToken;
  var orgname = req.params.orgname;
  var reponame = req.params.reponame;

  var origBranch = req.body.branchname;
  var issueid = req.body.issueid;
  var branchname = 'pbl/issue-' + issueid;

  console.log('origBranch = ' + origBranch);
  console.log('issueid = ' + issueid);

  v.waterfall([
    // form元ブランちのrefを取得
    function (callback) {
      var path = '/repos/' + orgname + '/' + reponame + '/git/refs/heads/' + origBranch;
      console.log('path = ' + path);
      callGithubAPI(path, accessToken, callback);
    },
    function (ref, callback) {
      console.log('ref = ');
      console.log(ref);
      var path = '/repos/' + username + '/' + reponame + '/git/refs';
      console.log('path = ' + path);
      var data = {'ref': 'refs/heads/' + branchname, 'sha': ref.object.sha};
      console.log('data = ');
      console.log(data);
      postGithubAPI(path, data, accessToken, callback);
    },
    function (res, callback) {
      var condition = {'orgname': orgname, 'reponame': reponame, 'username': username};
      var update = {$push: {issueid: issueid}};
      var options = {};
      Kanban.update(condition, update, options, function (err, result) {
        if (err) callback(err);
        callback(null, result);
      });
    }
  ], function (err, result) {
    if (err) console.log('err = ' + err);
    console.log('result = ');
    console.log(result);
    res.render('kanban-created', {'orgname': orgname, 'reponame': reponame, 'username': username, 'branchname': branchname});
  });
};


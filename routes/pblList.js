var request = require('superagent');
var Pbl = require('../models/pbl.js');

exports.list = function(req, res){
    var token = req.session.accessToken;
    request.get('https://api.github.com/repos/beerbu/github-agile-tool/issues?labels=PBL')
            .set('Authorization', 'token ' + token)
            .end(function(httpRes) {
                console.log(httpRes.text);
                var issues = JSON.parse(httpRes.text);

                var user = req.params.user;
                var project = req.params.project;
                Pbl.find({'username': user, 'reponame':project}, function(err, pbls) {
                    issues.forEach(function(issue) {
                        var pbl = null;
                        pbls.forEach(function(p) {
                            if(p.id == issue.number)
                                pbl = p;
                        });
                        issue.priority = pbl? pbl.priority:1000;
                        issue.point = pbl? pbl.point:'?';
                    });
                    res.render('list', {title:"List", issues:issues});
                });
            });
};

exports.setIssue = function(req, res) {
    var user = req.params.user;
    var project = req.params.project;
    var id = req.params.id;
    var point = req.query.point;
    var priority = req.query.priority;
    Pbl.findOne({'username': user, 'reponame':project, 'issueId':id}, function(err, issue) {
        if (err) console.log(err);
        if(!issue) {
            issue = new Pbl();
            issue.username = user;
            issue.reponame = project;
            issue.issueId = id;
        }
        issue.point = point? point: "?";
        issue.priority = priority? priority: 100;
        issue.save(function(err) {
            if (err) console.log(err);
            res.end("done");
        });
    });
}

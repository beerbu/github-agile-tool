var request = require('superagent');
var Pbl = require('../models/pbl.js');

exports.list = function(req, res){
    var token = req.session.accessToken;

    var user = req.params.user;
    var project = req.params.project;

    request.get('https://api.github.com/repos/'+user+'/'+project+'/issues?labels=PBL')
            .set('Authorization', 'token ' + token)
            .end(function(httpRes) {
                console.log(httpRes.text);
                var issues = JSON.parse(httpRes.text);

                Pbl.find({'username': user, 'reponame':project}, function(err, pbls) {
                    issues.forEach(function(issue) {
                        var pbl = null;
                        pbls.forEach(function(p) {
                            if(p.issueId == issue.number)
                                pbl = p;
                        });

                        issue.priority = pbl? pbl.priority:1000;
                        issue.point = pbl? pbl.point:'?';
                    });
                    console.log(req.session.passport);
                    issues.sort(function(a,b) {
                        return a.priority > b.priority ? 1: -1;
                    });
                    var iterating = false
                    if (project == 'github-agile-tool') {
                        iterating = true;
                    }
                    res.render('list', {title:"List", 'login': req.session.passport, issues:issues,
                                       user:user,project:project, iterating:iterating});
                });
            });
};

exports.setIssue = function(req, res) {
    var user = req.params.user;
    var project = req.params.project;
    var id = req.params.id;
    var point = req.body.point;
console.log('point'+point);
    var priority = req.body.priority;
    Pbl.findOne({'username': user, 'reponame':project, 'issueId':id}, function(err, issue) {
        if (err) console.log(err);
        if(!issue) {
            issue = new Pbl();
            issue.username = user;
            issue.reponame = project;
            issue.issueId = id;
            issue.point = '?';
            issue.priority = 9999;
        }
        if (point) {
            issue.point = point;
        }
        if(priority) {
            issue.priority = priority;
        }
        issue.save(function(err) {
            if (err) console.log(err);
            res.end("done");
        });
    });
}

//
//TODO use "User"
//
var request = require('superagent');
var Burndown = require('../models/burndown.js');
var Pbl = require('../models/pbl.js');

exports.graph = function(req, res) {
    //mongoからデータ取得
    var burndown = [];
    var verocity = [];

    var user = req.params.user;
    var project = req.params.project;

    Burndown.find({'project':project, 'type':'burndown'}).sort('iteration').exec(function(err, burn) {
        if(err) throw err;
        for(var i in burn) {
            var data = [burn[i].iteration, burn[i].point];
            console.log(data);
            burndown.push(data);
        }
        Burndown.find({'project':project, 'type':'sumClosed'}).sort('iteration').exec(function(err, burn) {
            if(err) throw err;
            for(var i in burn) {
                var d =  i==0? 0 : burn[i].point - burn[i-1].point;
                var data = [burn[i].iteration, d];
                console.log(data);
                verocity.push(data);
            }

            res.render('graph', {burndown:burndown, velocity:verocity, login:req.session.passport,
                                 user:user,project:project});
        });
    });
};

exports.createMock = function(req, res) {
    var project = 'github-agile-tool';

    var q = Burndown.remove({project:project});
    q.exec();
    setTimeout(function() {
        var sumOpened = [250,200,180,200,140,120,100];
        var sumClosed = [0,  50 ,70 ,80 ,140,165,185];
        for(var i=0;i<6;i++) {	
	    var iteration = i;
            var data = {'project':project, 'iteration':iteration, 'point':sumOpened[i], 'type':'burndown'};
            var burndown = new Burndown(data);
            burndown.save(function(err){
                console.log(err);
            });
        }
        for(var i=0;i<6;i++) {	
	    var iteration = i;
            var data = {'project':project, 'iteration':iteration, 'point':sumClosed[i], 'type':'sumClosed'};
            var burndown = new Burndown(data);
            burndown.save(function(err){
                console.log(err);
            });
        }
        res.end('ok');
    }, 1000);
}

exports.removeAll = function(req, res) {
    var project = 'github-agile-tool';
    var q = Burndown.remove({project:project});
    q.exec();
    res.redirect('/burndownCreate');
}

exports.batch = function(req, res) {
    var token = req.session.accessToken;

    var user = req.params.user;
    var project = req.params.project;

    request.get('https://api.github.com/repos/'+user+'/'+project+'/issues?labels=PBL&state=open')
            .set('Authorization', 'token ' + token)
            .end(function(httpRes) {
                request.get('https://api.github.com/repos/'+user+'/'+project+'/issues?labels=PBL&state=close')
                        .set('Authorization', 'token ' + token)
                        .end(function(httpRes2) {

                            console.log(httpRes.text);
                            var issuesOpen = JSON.parse(httpRes.text);
                            var issuesClose = JSON.parse(httpRes2.text);
                            var issues = issuesOpen.concat(issuesClose);

                            Pbl.find({'username': user, 'reponame':project}, function(err, pbls) {
                                var sumPoint=0, sumClosedPoint = 0;
                                issues.forEach(function(issue) {
                                    var pbl = null;
                                    pbls.forEach(function(p) {
                                        if(p.issueId == issue.number)
                                            pbl = p;
                                    });
                                    issue.point = pbl? pbl.point:'?';
                                    if(issue.point != '?') {
                                        if(issue.state == 'open') {
                                            sumPoint += parseInt(issue.point);
                                        } else {
                                            sumClosedPoint += parseInt(issue.point);
                                        }
                                    }
                                });


                                Burndown.findOne({'project':project, 'type':'burndown'}).sort('-iteration').exec(function(err, burn) {
                                    var iteration = burn.iteration+1;
                                    var point = sumPoint;
                                    var data = {'project':project, 'iteration':iteration, 'point':point, 'type':'burndown'};
                                    var burndown = new Burndown(data);
                                    burndown.save(function(err){
                                        var data = {'project':project, 'iteration':iteration, 'point':sumClosedPoint, 'type':'sumClosed'};
                                        var burndown = new Burndown(data);
                                        burndown.save(function(err){
                                            res.end(err?err:"ok");
                                        });
                                    });
                                });
                            });
                        });
            });
}

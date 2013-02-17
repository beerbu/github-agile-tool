exports.index = function(req, res) {
    var project = req.params.project;
    assign = [{name:'nakaji-dayo'}, {name:'akiomik'}, {name:'hiraya'}, {name:'servek'}];
	
    res.render('pblCreate/index', {project:project, assign:assign, login:req.session.passport});
};

exports.save = function(req, res) {
    console.log(req.body);
	var token= req.session.accessToken;
    var post_data = {"title":req.body.title, "labels":["PBL"], "body":req.body.comment};
    var postStr = JSON.stringify(post_data);
    console.log(postStr);
    var headers = {'Content-Type': 'application/json', 'Content-Length': postStr.length, 'Authorization': 'token ' + token};
    var options = {host: 'api.github.com', port: 443, path: '/repos/' + req.body.user + '/' + req.body.project + '/issues', method: 'POST', headers: headers};
	var http = require('https');
	var request = http.request(options, function(response) {
        response.setEncoding('utf-8');
        var responseString = '';
        response.on('data', function(data) {
            responseString += data;
			console.log(responseString);
            res.redirect('/' + req.body.user + '/' + req.body.project + '/pbl');
        });
    });
    request.write(postStr);
    request.end();
};

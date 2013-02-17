exports.index = function(req, res) {
    var project = req.params.project;
    assign = [{name:'nakaji-dayo'}, {name:'akiomik'}, {name:'hiraya'}, {name:'servek'}];
	
    res.render('pblCreate/index', {project:project, assign:assign});
};

exports.save = function(req, res) {
    console.log(req.body);
	var token= require('passport').session.accessToken;
	var post_data = {"title":req.body.title, "body":req.body.body, "labels":["PBL"]};
    var postStr = JSON.stringify(post_data);
    var headers = {'Content-Type': 'application/json', 'Content-Length': postStr.length}//, 'Authorization': 'token ' + token};
    var options = {host: 'api.github.com', port: 443, path: '/repos/' + req.session.passport.user.username + '/' + req.body.project + '/issues', method: 'POST', headers: headers};
	console.log(options);
	var http = require('https');
	var request = http.request(options, function(response) {
        response.setEncoding('utf-8');
        var responseString = '';
        response.on('data', function(data) {
            responseString += data;
			console.log(responseString);
            res.redirect('/pblCreate/index/' + (req.body.project));
        });
    });
    request.write(postStr);
    request.end();
};
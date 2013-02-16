var request = require('superagent');
var Pbl = require('../models/pbl.js');

exports.list = function(req, res){
    request.get('https://api.github.com/repos/beerbu/github-agile-tool/issues?labels=PBL')
            .end(function(httpRes) {
                var issues = JSON.parse(httpRes.text);
var i=0;
issues.forEach(function(issue) {
    issue.priority = i++;
});
                console.log(issues);
                res.render('list', {title:"List", issues:issues});
            });
};

exports.setPoint = function(req, res) {

}
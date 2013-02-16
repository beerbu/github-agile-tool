var request = require('superagent');
exports.list = function(req, res){
    request.get('https://api.github.com/repos/beerbu/github-agile-tool/issues?labels=PBL')
            .end(function(httpRes) {
                var issues = JSON.parse(httpRes.text);
                res.render('list', {title:"List", issues:issues});
            });
};
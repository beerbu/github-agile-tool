var Burndown = require('../models/burndown.js');

exports.graph = function(req, res) {
    //mongoからデータ取得
    var dummy = "[[1, 100], [2, 70], [3, 40], [4, 300]]";
	var dummy2 = "[[1, 0], [2, 30], [3, 30], [4, 200]]";
    res.render('graph', {burndown:dummy, velocity:dummy2, login:req.session.passport});
};

exports.createBurndownMock = function(req, res) {
    var project = 'github-agile-tool';
    var dummy = [[1, 100], [2, 70], [3, 40], [4, 300], [5, 150], [6, 100], [7, 50], [8, 0]];
    for(var i in dummy) {
		var data = {'project':project, 'iteration':dummy[i][0], 'point':dummy[i][1], 'type':'burndown'};
        Burndown.find(data, function(err, result) {
            if(err) return;
            if(result.length === 0) {
                var burndown = new Burndown(data);
                burndown.save(function(err){});
            }
        });
    }
    res.redirect('/burndown');
}

exports.createVelocityMock = function(req, res) {
    var project = 'github-agile-tool';
}

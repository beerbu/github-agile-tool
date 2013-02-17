var Burndown = require('../models/burndown.js');


exports.graph = function(req, res) {
    //mongoからデータ取得
    var dummy = [];
	var dummy2 = "[[1, 0], [2, 30], [3, 30], [4, 200]]";
	var project = 'github-agile-tool';
	Burndown.find({'project':project, 'type':'burndown'}, function(err, burn) {
        if(err) throw err;
        for(var i in burn) {
            var data = [burn[i].iteration, burn[i].point];
            console.log(data);
            dummy.push(JSON.stringify(data));
        }
        res.render('graph', {burndown:dummy, velocity:dummy2, login:req.session.passport});
    });
};

exports.createBurndownMock = function(req, res) {
    var project = 'github-agile-tool';
	var dummy = [[1, 100], [2, 70], [3, 40], [4, 300], [5, 150], [6, 100], [7, 50], [8, 0]];
    for(var i in dummy) {	
		var iteration = dummy[i][0];
        var point = dummy[i][1];
        var data = {'project':project, 'iteration':iteration, 'point':point, 'type':'burndown'};
        var burndown = new Burndown(data);
        burndown.save(function(err){});
    }
    res.redirect('/burndown');
}

exports.removeAll = function(req, res) {
	var project = 'github-agile-tool';
	var q = Burndown.remove({project:project});
	q.exec();
	res.redirect('/burndownCreate');
}

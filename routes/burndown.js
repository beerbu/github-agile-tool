exports.graph = function(req, res) {
    //mongoからデータ取得
    var dummy = "[{iter:1, point:100}, {iter:2, point:70}, {iter:3, point:40}, {iter:4, point:300}]";
    res.render('graph', {data:dummy});
};

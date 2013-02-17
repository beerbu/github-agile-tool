exports.graph = function(req, res) {
    //mongoからデータ取得
    var dummy = "[[1, 100], [2, 70], [3, 40], [4, 300]]";
    res.render('graph', {data:dummy});
};

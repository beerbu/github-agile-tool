
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', login:req.session.passport });
};
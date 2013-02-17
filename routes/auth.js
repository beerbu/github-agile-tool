exports.github = function(req, res){

};

exports.callback = function(req, res) {
    req.session.accessToken = require('passport').session.accessToken;
    res.redirect('/');
}

exports.account = function(req, res) {
    console.log(req.session);
    var session = require('passport').session;
    res.render('account',{title:'account info', session: session});
}

//認証ありページのミドルウェア
exports.useAuth = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
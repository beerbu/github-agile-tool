exports.github = function(req, res){

};

exports.callback = function(req, res) {
    res.redirect('/');
}

exports.account = function(req, res) {
    console.log(req.session);
    res.end('hello');
}

//認証ありページのミドルウェア
exports.useAuth = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , auth = require('./routes/auth')
  , pblList = require('./routes/pblList')
  , project = require('./routes/project')
  , pblCreate = require('./routes/pblCreate')
  , burndown = require('./routes/burndown')
  , http = require('http')
  , path = require('path');

var RedisStore = require('connect-redis')(express);

var passport = require('passport')
  , util = require('util')
  , GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: '1a7b2f7dd77ffccc8f7f',
    clientSecret: '138786757f33d98e52989bf91b33e3ed824f752f',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        passport.session.accessToken = accessToken;
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser('secret','heyheyhey'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session(
      {
        key: 'sess_id'
      , cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
      , store: new RedisStore({db: 1, prefix: 'session:'})
      }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
//認証実行
app.get('/auth/github',passport.authenticate('github', {scope: ['user','public_repo','repo','repo:status','notifications','gist']}) , auth.github);
//OAuthコールバック
app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        auth.callback);
//アカウント情報
app.get('/auth/account', auth.useAuth, auth.account);

//pbl一覧
app.get('/:user/:project/pbl', auth.useAuth, pblList.list);
//pbl更新
app.post('/:user/:project/pbl/:id', auth.useAuth, pblList.setIssue);

// project
app.get('/projects', auth.useAuth, project.index);
// app.get('/projects/:name', project.loadProject, project.detail);
app.post('/projects/new', auth.useAuth, project.create);

app.get('/pblCreate/index/:project', auth.useAuth, pblCreate.index);
app.post('/pblCreate/save', auth.useAuth, pblCreate.save);

app.get('/:user/:project/burndown', auth.useAuth, burndown.graph);
app.get('/burndownCreate', auth.useAuth, burndown.createBurndownMock);
app.get('/burndownRemove', auth.useAuth, burndown.removeAll);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

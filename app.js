/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes');
var userController = require('./routes/user_controller');
var contentController = require('./routes/content_controller');
var about = require('./routes/about');
var profile = require('./routes/profile');
var http = require('http');
var path = require('path');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var GOOGLE_CLIENT_ID = "472666237299.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "i9SyhZD6rqDKvsmXvXZFukzs";

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/login/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



var app = express();
app.configure(function(){
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({uploadDir:'./files'}));
app.use(express.cookieParser());

app.use(express.cookieSession(({ secret: 'secret', maxAge: 360*5 })));
app.use(express.session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
});
app.get('/', routes.index);
app.get('/about', about.show);
app.get('/profile',profile.showProfile);
app.get('/file_upload',profile.uploadFile);

app.get('/login/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){}
);

app.get('/login/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    userController.login(req,res);
  });

app.get('/logout', function(req, res){

  req.logOut();
  res.redirect('/');
});

app.get('/file_download',contentController.download);
app.get('/file_public',contentController.public);
app.get('/file_private',contentController.private);
app.get('/file_share',contentController.share);
app.post('/file_upload',contentController.create);
app.post('/file_delete',contentController.delete);
app.post('/search_public',contentController.searchPublic);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
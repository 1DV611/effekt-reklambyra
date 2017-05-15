
var express = require('express');
var app = express();

var dotenv = require('dotenv');

var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var GoogleOauthStrategy = require('passport-google-oauth').OAuth2Strategy;
var InstagramStrategy = require('passport-instagram');
var LinkedinStrategy = require('passport-linkedin');
var TwitterStrategy = require('passport-twitter');
var FacebookStrategy = require('passport-facebook');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var exphbs = require('express-handlebars');

var connectToDatabase = require('./databaseOperations/connectToDatabase');
var handleLogin = require('./databaseOperations/User/handleLogin');

var hbsHelpers = require('../views/helpers.js');

dotenv.load();

connectToDatabase(process.env.MLAB_CREDENTIAL_STRING);

// Routes
var routes = require('../routes/start');
var user = require('../routes/user');
var socialChannels = require('../routes/channelAuth');

var port = process.env.port || 3000;

var socialChannelCallback = function (accessToken, refreshToken, extraParams, profile, done) {
  // accessToken är för Auth0s API och behövs oftast inte
  // extraParams.id_token har JWT
  // profile har användarens profilinfo
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  profile.id_token = extraParams.id_token;
  profile.extraParams = extraParams;
  return done(null, profile);
};

var userLoginCallback = function (accessToken, refreshToken, extraParams, profile, done) {
  /* sets the profile to true/false depending if the user logging in has
  been assigned the admin role in auth0 or not;
  */
  profile.admin = profile._json.app_metadata.authorization.roles['0'] === 'admin';
  profile.id = profile.identities['0'].user_id;
  handleLogin(profile);
  return done(null, profile);
};

passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
}, userLoginCallback));

passport.use(new GoogleOauthStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/google/callback'
}, socialChannelCallback));

passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/instagram/callback'
}, socialChannelCallback));

/* the consumerKey is actually called CLIENT ID in linkedins api console
and the consumerSecret CLIENT SECRET. there is no actual linkedin API key,
the linkedin passport strategy is a bit dated and uses oauth 1.0.
https://github.com/jaredhanson/passport-linkedin
*/
passport.use(new LinkedinStrategy({
  consumerKey: process.env.LINKEDIN_CLIENT_ID,
  consumerSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/linkedin/callback'
}, socialChannelCallback));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/twitter/callback'
}, socialChannelCallback));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/facebook/callback'
}, socialChannelCallback));

// minskar storleken på payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('combined'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// the helpers object is imported from a separate file in views/helpers.js
var hbs = exphbs.create(hbsHelpers);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/../client/')));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/css', express.static(__dirname + '/../client/css'));
app.use('/js', express.static(__dirname + '/../client/js'));
app.use('/js/lib', express.static(__dirname + '/../client/js/lib'));
app.use('/js/lib/charts', express.static(__dirname + '/../client/js/lib/charts'));
app.use(favicon((__dirname + '/../client/favicon.ico')));

app.use('/auth', socialChannels);
app.use('/', routes);
app.use('/user', user);

// Fånga och ge error till handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler för dev, skriver ut stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler utan stacktrace
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

//todo uncomment to try running the cron job

module.exports = app;

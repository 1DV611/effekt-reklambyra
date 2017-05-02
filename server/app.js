const express = require('express');
const app = express();

const dotenv = require('dotenv');

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const GoogleOauthStrategy = require('passport-google-oauth').OAuth2Strategy;
const InstagramStrategy = require('passport-instagram');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const session = require('express-session');
const exphbs = require('express-handlebars');
const http = require('http');

dotenv.load();

// Routes
const routes = require('../routes/start');
const user = require('../routes/user');
const socialChannels = require('../routes/channelAuth');

const port = process.env.port || 3000;

let standardAuthCallback = function (accessToken, refreshToken, extraParams, profile, done) {
  // accessToken är för Auth0s API och behövs oftast inte
  // extraParams.id_token har JWT
  // profile har användarens profilinfo
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  profile.id_token = extraParams.id_token;
  profile.extraParams = extraParams;
  return done(null, profile);
};

passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
}, standardAuthCallback));

passport.use(new GoogleOauthStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, standardAuthCallback));

passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/instagram/callback',
}, standardAuthCallback));

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
  secret: 'hemlis!!',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({
  helpers: {},
  defaultLayout: 'main',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/../client/')));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/css', express.static(__dirname + '/../client/css'));
app.use('/js', express.static(__dirname + '/../client/js'));
app.use(favicon((__dirname + '/../client/favicon.ico')));

app.use('/', routes);
app.use('/user', user);
app.use('/auth', socialChannels);

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

module.exports = app;

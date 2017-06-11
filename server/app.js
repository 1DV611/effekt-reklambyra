'use strict';
var express = require('express');
var app = express();

var dotenv = require('dotenv');
// måste anropas innan en process.env.VARIABLE används, laddar environment variables
dotenv.load();

var passport = require('./auth');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var exphbs = require('express-handlebars');
var hbsHelpers = require('../views/helpers.js');

var connectToDatabase = require('./databaseOperations/connectToDatabase');
connectToDatabase(process.env.MLAB_CREDENTIAL_STRING);

var scheduledJobs = require('./scheduledJobs');

// Appens controllers, dvs urls lagrade i separat fil.
var routes = require('../routes/start');
var user = require('../routes/user');
var socialChannels = require('../routes/channelAuth');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('combined'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
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

module.exports = app;

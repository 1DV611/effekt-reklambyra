var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var customerReportSettings = require('../client/js/lib/customerReportSettings.js');
var resultsFromGoogleApi = require('../client/js/lib/resultsFromGoogleApi.js');
var reportGenerator = require('../server/reportGenerator.js');

/* GET user profile. */

router.get('/', ensureLoggedIn, function (req, res, next) {
  res.render('dashboard', { user: req.user });
});

router.get('/dashboard', ensureLoggedIn, function (req, res, next) {
  /*
    Skicka objekt med information från Auth0 om vilka sociala medier som är aktiverade för användaren
  */
  res.render('dashboard', { user: req.user });
});

router.get('/reports', ensureLoggedIn, function (req, res, next) {
  res.render('reports', { user: req.user });
});

router.get('/report/:id', ensureLoggedIn, function (req, res, next) {
  res.render('report', { user: req.user });
});

router.get('/pdf', ensureLoggedIn, reportGenerator);

router.get('/dashboard', ensureLoggedIn, function (req, res, next) {
  /*
    Skicka objekt med information från Auth0 om vilka sociala medier som är aktiverade för användaren
  */
  res.render('dashboard', { user: req.user });
});

router.post('/preview', ensureLoggedIn, customerReportSettings); //customerReportSettings

router.get('/example', ensureLoggedIn, resultsFromGoogleApi); //resultsFromGoogleApi

router.get('/settings', ensureLoggedIn, function (req, res, next) {
  res.render('settings', { user: req.user });
});

module.exports = router;

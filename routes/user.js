var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var customerReportSettings = require('../client/js/lib/customerReportSettings.js');
var resultsFromGoogleApi = require('../client/js/lib/resultsFromGoogleApi.js');
var getReportByMonthAndYear = require('./../server/databaseOperations/Report/getReportByMonthAndYear');
var reportGenerator = require('../server/reportGenerator.js');
var APIs = require('../model/callAPIs');
var getUserAccess = require('../server/databaseOperations/ApiAccess/getUserAccess');

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

router.get('/report/:month/:year', ensureLoggedIn, function (req, res, next) {
  /**
   * So if a logged in user goes to localhost:3000/preview/january/2017 , then the database would be
   * queried for reports belonging to that user matching that date.
   */
  getReportByMonthAndYear(req.user.id, req.params.month, req.params.year)
    .then(function (dataForUser) {
      res.render('preview', { user: req.user, form: dataForUser });
    });
});

router.get('/pdf', ensureLoggedIn, reportGenerator);

router.get('/dashboard', ensureLoggedIn, function (req, res, next) {
  /*
   Skicka objekt med information från Auth0 om vilka sociala medier som är aktiverade för användaren
   */
  res.render('dashboard', { user: req.user });
});

router.get('/preview', ensureLoggedIn, function (req, res) {
  getUserAccess(req.user.id).then(function (access) {
    APIs.callAPIsWith(access).then(function (apiData) {
      res.render('preview', { form: apiData });
    });
  });
});

router.get('/example', ensureLoggedIn, resultsFromGoogleApi); //resultsFromGoogleApi

router.get('/settings', ensureLoggedIn, function (req, res, next) {
  res.render('settings', { user: req.user });
});

module.exports = router;

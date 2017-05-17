'use strict';

var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var customerReportSettings = require('../client/js/lib/customerReportSettings.js');
var resultsFromGoogleApi = require('../client/js/lib/resultsFromGoogleApi.js');
var getDataFor = require('./../server/databaseOperations/ApiData/getDataFor');
var getReportByMonthAndYear = require('./../server/databaseOperations/Report/getReportByMonthAndYear');
var reportGenerator = require('../server/reportGenerator.js');
var createReport = require('../server/databaseOperations/Report/createReport');
var createAPIData = require('../server/databaseOperations/ApiData/createAPIData');
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

router.post('/reports', ensureLoggedIn, function (req, res, next) {
  var a = getDataFor(req.user.id, req.body.month, req.body.year);
  res.render('reports', { user: req.user, report: a });
});

router.get('/reports/:id', ensureLoggedIn, function (req, res, next) {
  res.render('report', { user: req.user });
});

//  get report and apidata for period and returns form: { report: report, data: data }
router.get('/report/:month/:year', ensureLoggedIn, function (req, res, next) {

  /**
   * So if a logged in user goes to localhost:3000/preview/january/2017 , then the database would be
   * queried for reports belonging to that user matching that date.
   */
  var dataForUser = getReportByMonthAndYear(req.user.id, req.params.month, req.params.year);
  res.render('preview', { user: req.user, form: dataForUser });

});

router.get('/pdf', ensureLoggedIn, reportGenerator);

router.get('/dashboard', ensureLoggedIn, function (req, res, next) {
  /*
   Skicka objekt med information från Auth0 om vilka sociala medier som är aktiverade för användaren
   */
  res.render('dashboard', { user: req.user });
});

router.get('/preview', ensureLoggedIn, function (req, res) {
  //  TODO: Reset after callAPIsWith is fixed
  getUserAccess(req.user.id).then(function (access) {
    APIs.callAPIsWith(access).then(function (apiData) {
      res.render('preview', { form: apiData });
    });
  });
});

//  creates report and apidata for period and returns form: { report: report, data: data }
router.get('/preview/:month/:year', ensureLoggedIn, function (req, res) {
  var report = createReport(req.user.id, req.params.month, req.params.year);
  var data = createAPIData(report);
  res.render('preview', { form: { report: report, data: data } });
});

router.get('/example', ensureLoggedIn, resultsFromGoogleApi); //resultsFromGoogleApi

router.get('/settings', ensureLoggedIn, function (req, res, next) {
  res.render('settings', { user: req.user });
});

module.exports = router;

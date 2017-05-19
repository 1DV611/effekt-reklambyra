var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var createReport = require('./../server/databaseOperations/Report/createReport');
var createApiData = require('./../server/databaseOperations/ApiData/createApiData');

var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var getDataFor = require('./../server/databaseOperations/ApiData/getDataFor');
var getAllReportsAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getAllReportsByMonthAndYear');
var reportGenerator = require('../server/reportGenerator.js');
var APIs = require('../model/callAPIs');
var reports;
var completeReport;
var data;

/**
 * /user/ - router
 * med ensureLoggedIn säkerställer vi att användaren finns i auth0s
 * användarregister för applikationen
 */

//  Hämtar användarprofil från auth0.
router.get('/',
  ensureLoggedIn,
  function (req, res) {
    res.render('dashboard', { user: req.user });
  });

//  Visar dashboarden i vilken rapport kan väljas baserat på månad och år för inloggad användare
router.get('/dashboard',
  ensureLoggedIn,
  function (req, res) {
    res.render('dashboard', { user: req.user });
  });

/**
 * Hämtar användarens rapport och apidata för perioden, exemplevis localhost:3000/report/1/2016
 * hämtar data för februari 2016 och returnerar preview-sidan med
 * form: { report: report, data: data }
 */
router.get('/report/:month/:year',
  ensureLoggedIn,
  getReportAndDataByMonthAndYear
);

/**
 * Hämtar alla rapporter (array) resp. apidata om användaren är admin
 * { reports: reports, data: data } listas på reports-sidan
 */
router.get('/reports/:month/:year',
  ensureLoggedIn,
  function (req, res) {
    reports = getAllReportsAndDataByMonthAndYear(req.params.month, req.params.year);
    res.render('reports', { user: req.user, reports: reports });
  });

//  hämtar inställningssida för inloggad användare
router.get('/settings',
  ensureLoggedIn,
  function (req, res) {
    res.render('settings', { user: req.user });
  });

//  skapar rapport-pdf
router.get('/pdf',
  ensureLoggedIn,
  reportGenerator);

//  testa att skapa rapport - använd i cronJob?
router.get('/test/:month/:year',
  ensureLoggedIn,
  function (req, res) {
    createApiData(createReport(req.user.id, req.params.month, req.params.year));
    res.render('reports', { user: req.user });
  });

module.exports = router;

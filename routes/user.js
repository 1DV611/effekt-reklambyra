var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var createReport = require('./../server/databaseOperations/Report/createReport');
var createApiData = require('./../server/databaseOperations/ApiData/createApiData');

var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var getAllReportsAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getAllReportsByMonthAndYear');
var getSettings = require('./../server/getSettings.js');
var updateSocialChannelProfile = require('./../server/databaseOperations/ApiAccess/updateSocialChannelProfile');
var saveReport = require('./../server/saveReport.js');
var pdfGenerator = require('../server/pdfGenerator.js');
var reports;

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
  function (req, res) {
    getReportAndDataByMonthAndYear(req, res).then(function (viewObj) {
      res.render('preview', viewObj);
    });
  }
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
  getSettings);

//  inaktivera media och återvänder till settings
router.post('/updatesettings',
  ensureLoggedIn,
  function (req, res, next) {
    let socialChannels = [];
    if (!req.body.adwords) {
      socialChannels.push('adwords');
    }
    if (!req.body.facebook) {
      socialChannels.push('facebook');
    }
    if (!req.body.tynt) {
      socialChannels.push('tynt');
    }
    if (!req.body.addthis) {
      socialChannels.push('addthis');
    }
    if (!req.body.twitter) {
      socialChannels.push('twitter');
    }
    if (!req.body.linkedin) {
      socialChannels.push('linkedin');
    }
    if (!req.body.moz) {
      socialChannels.push('moz');
    }
    if (!req.body.instagram) {
      socialChannels.push('instagram');
    }
    if (!req.body.google) {
      socialChannels.push('google');
    }
    updateSocialChannelProfile(req.user.id, socialChannels);
    res.redirect('settings');
  });

//  skapar rapport-pdf
router.post('/pdf',
  ensureLoggedIn,
  function (req, res, next) {
    saveReport(req, res, next);
    pdfGenerator(req, res, next);
  }
);



//  testa att skapa rapport - använd i cronJob?
router.get('/test/:month/:year',
  ensureLoggedIn,
  function (req, res) {
    createApiData(createReport(req.user.id, req.params.month, req.params.year));
    res.render('reports', { user: req.user });
  });

module.exports = router;

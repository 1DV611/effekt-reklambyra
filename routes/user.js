'use strict';
var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var createReport = require('./../server/databaseOperations/Report/createReport');
var createApiData = require('./../server/databaseOperations/ApiData/createApiData');

var getMonthsAndYearsOfUserReports = require('./../server/databaseOperations/Report/getMonthsAndYearsOfUserReports');
var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var getAllReportsAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getAllReportsByMonthAndYear');
var getSettings = require('./../server/getSettings.js');
var updateSocialChannelProfile = require('./../server/databaseOperations/ApiAccess/updateSocialChannelProfile');
var saveReport = require('./../server/saveReport.js');
var sendPdf = require('./../server/sendPdf.js');
var pdfGenerator = require('../server/pdfGenerator.js');
var seedDatabase = require('../server/helpers/seedDatabase');

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
      getMonthsAndYearsOfUserReports(req.user.id)
        .then(function (dates) {
          console.log(dates);
          res.render('dashboard', { user: req.user, dates: dates });
        }).catch(function (err) {
          console.log('ERROR: GET /dashboard:', err);
          res.render('500', { err: err });
        });
    });

//  Visar dashboarden i vilken rapport kan väljas baserat på månad och år för inloggad användare
router.get('/dashboard',
    ensureLoggedIn,
    function (req, res) {
      getMonthsAndYearsOfUserReports(req.user.id)
        .then(function (dates) {
          console.log(dates);
          res.render('dashboard', { user: req.user, dates: dates });
        }).catch(function (err) {
          console.log('ERROR: GET /dashboard:', err);
          res.render('500', { err: err });
        });
    });

/**
 * Hämtar användarens rapport och apidata för perioden, exemplevis localhost:3000/report/1/2016
 * hämtar data för februari 2016 och returnerar preview-sidan med
 * form: { report: report, data: data } */
router.get('/report/:month/:year',
    ensureLoggedIn,
    function (req, res) {
      // Kom ihåg query för ev. pdf-generering
      req.app.locals.queries = req.query;

      getReportAndDataByMonthAndYear(req.user, req.query, req.params.month, req.params.year)
          .then(function (viewObj) {
            res.render('preview', {user: req.user, viewObj: viewObj});
          }).catch(function (err) {
        console.log('ERROR: GET /report/:month/:year:', err);
        res.render('500', {err: err});
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
      res.render('reports', {user: req.user, reports: reports});
    });

//  hämtar inställningssida för inloggad användare
router.get('/settings',

    ensureLoggedIn,
    getSettings);

//  inaktivera media och återvänder till settings
router.post('/updatesettings',
    ensureLoggedIn,
    function (req, res, next) {
      var socialChannels = [];
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

// callar alla apier med inloggad users access objekt
router.get('/settings/update-database',
    ensureLoggedIn,
    function (req, res) {
      seedDatabase.forUser(req.user.id);
      res.redirect('/user/settings');
    });

//  sparar manuellt inmatad information och skapar pdf
//  Funktionen är beroende av att req.app.locals.queries
//  sätts i routen för /user/report/:month/:year
router.post('/pdf',
    ensureLoggedIn,
    function (req, res, next) {
      saveReport(req, res, next).then(function (report) {
        return pdfGenerator(
            req.user,
            req.app.locals.queries,
            req.body.month,
            req.body.year,
            report.summary,
            report.optimization,
            report.recommendation,
            res
        ).then(function (source) {
          return sendPdf(source, res)
        });
      }).catch(function (err) {
        console.log('ERROR: POST /PDF:', err);
        res.render('500', {err: err});
      });
    }
);

//  testa att skapa rapport - använd i cronJob?
router.get('/test/:month/:year',
    ensureLoggedIn,
    function (req, res) {
      createReport(req.user.id, req.params.month, req.params.year)
        .then(function (report) {
          if (report !== undefined) {
            createApiData(report);
            res.render('reports', { user: req.user });
          } else {
            res.render('500', { err: 'Report already exists.' });
          }
        }).catch(function (err) {
          res.render('500', { err: err });
        });
});

module.exports = router;

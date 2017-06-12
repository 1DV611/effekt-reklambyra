'use strict';
var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var getUsers = require('./../server/databaseOperations/User/getUsers');
var getAllReports = require('./../server/databaseOperations/Report/getAllReports');

var createReport = require('./../server/databaseOperations/Report/createReport');
var createApiData = require('./../server/databaseOperations/ApiData/createApiData');

var getUserAccess = require('./../server/databaseOperations/ApiAccess/getUserAccess.js');
var apiAccessIntersection = require('./../server/helpers/apiAccessIntersection.js');

var getMonthsAndYearsOfUserReports = require('./../server/databaseOperations/Report/getMonthsAndYearsOfUserReports');
var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var getSettings = require('./../server/getSettings.js');
var updateSocialChannelProfile = require('./../server/databaseOperations/ApiAccess/updateSocialChannelProfile');
var saveReport = require('./../server/saveReport.js');
var sendPdf = require('./../server/sendPdf.js');
var generateHtmlForPdf = require('../server/generateHtmlForPdf.js');
var seedDatabase = require('../server/helpers/seedDatabase');

/**
 * /user/ - router
 * med ensureLoggedIn säkerställer vi att användaren finns i auth0s
 * användarregister för applikationen
 */

/** Hämtar användarprofil från auth0.
 * Om admin - dashboard visas med autocomplete sök för alla rapporter
 * Om icke-admin - dasbhoard med egna rapporter
 * **/
router.get('/',
  ensureLoggedIn,
  function (req, res) {
    if (req.user.admin) {
      res.render('dashboard', { user: req.user });
    } else {
      getMonthsAndYearsOfUserReports(req.user.id)
        .then(function (dates) {
          res.render('dashboard', { user: req.user, dates: dates });
        }).catch(function (err) {
          console.log('ERROR: GET /dashboard:', err);
          res.render('500', { err: err });
        });
    }
  });

/** Hämtar användarprofil från auth0.
 * Om admin - dashboard visas med autocomplete sök för alla rapporter
 * Om icke-admin - dasbhoard med egna rapporter
 * **/
router.get('/dashboard',
  ensureLoggedIn,
  function (req, res) {
    if (req.user.admin) {
      res.render('dashboard', { user: req.user });
    } else {
      getMonthsAndYearsOfUserReports(req.user.id)
        .then(function (dates) {
          res.render('dashboard', { user: req.user, dates: dates });
        }).catch(function (err) {
          console.log('ERROR: GET /dashboard:', err);
          res.render('500', { err: err });
        });
    }
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
        res.render('preview', { user: req.user, viewObj: viewObj });
      }).catch(function (err) {
        console.log('ERROR: GET /report/:month/:year:', err);
        res.render('500', { err: err });
      });
  }
);

/**
 * Hämtar alla avändare för dashboardens autocomplete som json
 */
router.get('/users',
  ensureLoggedIn,
  function (req, res) {
    getUsers()
      .then(function (users) {
        res.status(200).json({ users: users });
      }).catch(function (err) {
        res.status(500).json({ error: err });
      });
  });

/**
 * Hämtar alla rapporter för en användare
 * används till dashboarden för admin
 */
router.get('/:user/reports/',
  ensureLoggedIn,
  function (req, res) {
    if (req.user.admin) {
      getAllReports(req.params.user)
        .then(function (reports) {
          res.status(200).json({ reports: reports });
        }).catch(function (err) {
          res.status(500).json({ error: err });
        });
    }
  });

/**
 * Hämtar alla rapporter för en användare och specifikt år
 * används till dashboarden för admin
 */
router.get('/:user/reports/:fullyear',
  ensureLoggedIn,
  function (req, res) {
    if (req.user.admin) {
      getAllReports(req.params.user, req.params.fullyear)
        .then(function (reports) {
          res.status(200).json({ reports: reports });
        }).catch(function (err) {
          res.status(500).json({ error: err });
        });
    }
  });

/**
 * Hämtar apiobject för specifik användare för dashboard - ej klar
 * används till dashboarden för admin
 */
router.get('/:user/access',
  ensureLoggedIn,
  function (req, res) {
    var apiAccessKeys;
    var medias;
    var allMediaNames = [
      'addthis',
      'facebook',
      'google',
      'instagram',
      'linkedin',
      'moz',
      'tynt',
      'twitter',
    ];

    if (req.user.admin) {
      getUserAccess(req.params.user)
        .then(function (apiAccess) {
          apiAccessKeys = Object.keys(apiAccess._doc);

          medias = allMediaNames.map(function (mediaName) {
            return {
              name: mediaName,
              isActive: apiAccessIntersection(allMediaNames, apiAccessKeys).includes(mediaName),
            };
          });

          res.status(200).json({ medias: medias });
        }).catch(function (err) {
          res.status(500).json({ error: err });
        });
    } else {
      getUserAccess(req.session.authZeroUserID)
        .then(function (apiAccess) {
          apiAccessKeys = Object.keys(apiAccess._doc);

          medias = allMediaNames.map(function (mediaName) {
            return {
              name: mediaName,
              isActive: apiAccessIntersection(allMediaNames, apiAccessKeys).includes(mediaName),
            };
          });

          res.status(200).json({ medias: medias });
        }).catch(function (err) {
          res.status(500).json({ error: err });
        });
    }
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
      return generateHtmlForPdf(
        req.user,
        req.app.locals.queries,
        req.body.month,
        req.body.year,
        report.summary,
        report.optimization,
        report.recommendation,
        res
      ).then(function (source) {
        return sendPdf(source, res);
      });
    }).catch(function (err) {
      console.log('ERROR: POST /PDF:', err);
      res.render('500', { err: err });
    });
  }
);

module.exports = router;

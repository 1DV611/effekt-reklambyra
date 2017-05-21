'use strict';
var dotenv = require('dotenv');
dotenv.load();
var nodeLinkedin = require('node-linkedin')(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET, process.env.BASE_URL + '/auth/linkedin/callback');
var linkedin;
var dateHelper = require('../../server/helpers/epochToDate');
var relevantDate;

//todo accidentally put in master, can be safely removed

var runLinkedin = function (token, startDate) {
  relevantDate = dateHelper(startDate);
  return new Promise(function (resolve) {

    linkedin = nodeLinkedin.init(token);
    var result = [];

    linkedin.companies.asAdmin(function (err, isAdminFor) {
      isAdminFor.values.forEach(function (companyPage) {
        result.push(getCompanyStatsFor(companyPage));
      });

      Promise.all(result).then(function (linkedInData) {
        var returnObj = {linkedin: linkedInData};
        resolve(returnObj);
      });

    });
  });
};


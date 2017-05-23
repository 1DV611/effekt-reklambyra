'use strict';
var dotenv = require('dotenv');
dotenv.load();
var nodeLinkedin = require('node-linkedin')(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET, process.env.BASE_URL + '/auth/linkedin/callback');
var linkedin;
var dateHelper = require('../helpers/epochToDate');
var relevantDate;


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

runLinkedin('AQXz50SrajbMAz8P1FxmT0Rino63BfZPWD9oHB2rgVovvUIC9C8PZF9p76Hauc8kZjxlDobpuvuC-ZmstF0nWI3vTG2P7j4VRwA9a_rxgtf8pO5D_62Kozn5WVyFvv7obpQSNjTSIQzUBV3xZhBYzQvWiZFtHu1zWC7Yj-pZyS2EKJYek2U', 1495356124).then(function (res) {
  console.log(res);
});

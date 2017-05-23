'use strict';
var dotenv = require('dotenv');
dotenv.load();
var nodeLinkedin = require('node-linkedin')(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET, process.env.BASE_URL + '/auth/linkedin/callback');
var linkedin;
var dateHelper = require('../helpers/epochToDate');
var relevantDate;

module.exports = function (profile, startDate) {
  var token = profile.accessToken;

  relevantDate = dateHelper(startDate);
  return new Promise(function (resolve) {

    linkedin = nodeLinkedin.init(token);
    var result = [];

    /**
     * Plockar först fram alla företagssidor som relevant användare är admin för. Loopar dessa
     * och bygger ett return objekt med data för alla sidor.
     */

    linkedin.companies.asAdmin(function (err, isAdminFor) {
      isAdminFor.values.forEach(function (companyPage) {
        result.push(getCompanyStatsFor(companyPage));
      });

      Promise.all(result).then(function (linkedInData) {
        var returnObj = { linkedin: linkedInData };
        resolve(returnObj);
      });

    });
  });

};

function getCompanyStatsFor(companyPage) {
  var returnObj = {
    name: companyPage.name,
    // sparar id iom att name kan bytas så för att alltid kunna återkoppla data till page
    id: companyPage.id
  };

  return new Promise(function (resolve) {
    /**
     * company_stats node har all företagsstatistik för senaste 12 månaderna. Max 14 månaders data finns sparad.
     * All data begärs och sedan filtreras relevant månad fram.
     */
    linkedin.companies.company_stats(companyPage.id, function (error, companyStats) {

      if (error) console.error(error);

      returnObj.interactions = interactionsForMonth(companyStats.statusUpdateStatistics.viewsByMonth);
      returnObj.followers = followersForMonth(companyStats.followStatistics.countsByMonth);
      resolve(returnObj);

    });
  });
}

function interactionsForMonth(viewsByMonth) {
  var result = { error: 'No interactions data found for ' + relevantDate.year + '/' + relevantDate.month };
  var value = getForRelevantMonth(viewsByMonth.values);

  if (value) {
    result = {
      clicks: value.clicks,
      comments: value.comments,
      engagement: value.engagement,
      impressions: value.impressions,
      likes: value.likes,
      shares: value.shares
    }
  }

  return result;
}

function followersForMonth(countsByMonth) {
  var result = { error: 'No followers data found for ' + relevantDate.year + '/' + relevantDate.month };
  var value = getForRelevantMonth(countsByMonth.values);

  if (value) {
    result = { newCount: value.newCount, totalCount: value.totalCount }
  }

  return result;
};

/**
 * Helper funktion för att loopa och filtrera efter relevant månad på ett enkelt sätt.
 * Iaf ni bygger på linkedin APIet tänk på att denna ändrar relevantDate.month vid januari, iaf
 * ni har andra funktioner som då förväntar sig att 1 betyder Februari kan det bli ett problem.
 */
function getForRelevantMonth(values) {
  var month = relevantDate.month;
  //todo måste lägga på +1 för alla?
  //todo om äldre år än 12m?
  // Linkedin sparar Januari som 1 medans epoch räknar Januari som 0 därav detta för att hantera edge case
  if (month === 0) relevantDate.month = 1;
  var result = false;

  values.forEach(function (value) {
    if (value.date.month === relevantDate.month && value.date.year === relevantDate.year) {
      result = value;

    }
  });
  return result;
}
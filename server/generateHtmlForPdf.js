var fs = require('fs');
var handlebars = require('handlebars');
var inline = require('inline-source');
var path = require('path');
var cheerio = require('cheerio');

var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var monthToNumber = require('./helpers/monthToNumber.js');

/**
 * Skapar en kombination av html, css och javascript som fungerar som underlag för en pdf-rapport. Kombinationen baseras till stor del på filen views/preview.handlebars, vilket gör att ändringar i denna fil påverkar funktionens resultat.
 */
function generateHtmlForPdf(user, query, month, year, summary, optimization, recommendation) {
  return new Promise(function (resolve, reject) {
    getReportAndDataByMonthAndYear(user, query, monthToNumber(month), year).then(function (context) {
        var obj = {
          viewObj: context,
          queries: context.queries,
        };
        readFromFile('./views/preview.handlebars')
          .then(function (fileContent) {
            return fillHandlebarsContext(obj, fileContent);
          })
          .then(addCss)
          .then(function (cssHtml) {
            var finalHtml = postProcess(cssHtml, summary, optimization, recommendation);
            resolve(finalHtml);
          })
          .catch(function (err) { reject(err); });
      });
  });
}

/*
 * Läser data från angiven fil
 */
function readFromFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf-8', function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

/*
 * Hämtar styling från css-filer och konkatenerar med html.
 * Vilka css-filer som refereras styrs av filen views/preview.handlebars.
 */
function addCss(html) {
  return new Promise(function (resolve, reject) {
    var external_refs = " \
      <link inline href='css/light-bootstrap-dashboard.css'> \
      <link inline href='css/toogle-switch.css'> \
      <link inline href='css/style.css'> \
      <script inline src='js/lib/charts/createChart.js'></script> \
      <script inline src='js/lib/charts/createData.js'></script> \
    ";
    inline(external_refs, { rootpath: path.resolve('client') }, function (err, inlines) {
      if (err) reject(err);
      resolve(inlines + html);
    });
  });
}

/*
 * Applicerar data till html med hjälp av Handlebars
 */
function fillHandlebarsContext(context, html) {
  var template = handlebars.compile(html);
  return template(context);
}

/*
 * Fyller i rapportens textfält
 */
function postProcess(html, summary, optimization, recommendation) {
  var $ = cheerio.load(html);
  $('#summaryTextarea').text(summary);
  $('#optimizationTextarea').text(optimization);
  $('#recommendationTextarea').text(recommendation);
  $('#createPdfButton').remove();
  return $.html();
}

module.exports = generateHtmlForPdf;

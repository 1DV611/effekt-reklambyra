var fs = require('fs');
var handlebars = require('handlebars');
var inline = require('inline-source');
var path = require('path');
var cheerio = require('cheerio');

var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var monthToNumber = require('./helpers/monthToNumber.js');

function pdfGenerator(user, query, month, year, summary, optimization, recommendation) {
  return new Promise(function(resolve, reject) {
  getReportAndDataByMonthAndYear(user, query, monthToNumber(month), year).then(function(context) {
    readFromFile('./views/preview.handlebars')
      .then(function(fileContent) {
        return fillHandlebarsContext(context, fileContent);
      })
      .then(addCss)
      .then(function(cssHtml) {
        var finalHtml = postProcess(cssHtml, summary, optimization, recommendation);
        resolve(finalHtml);
      })
      .catch(function(err) { reject(err); });
    });
  });
}

function readFromFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf-8', function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  })
}

function addCss(html) {
  return new Promise(function(resolve, reject) {
    var external_refs = " \
      <link inline href='css/light-bootstrap-dashboard.css'> \
      <link inline href='css/toogle-switch.css'> \
      <link inline href='css/style.css'> \
      <script inline src='js/lib/charts/createChart.js'></script> \
      <script inline src='js/lib/charts/createData.js'></script> \
    ";
    inline(external_refs, { rootpath: path.resolve('client') }, function (err, inlines) {
      if (err) reject(err);
      resolve(inlines+html);
    });
  });
}

function fillHandlebarsContext(context, html) {
  var template = handlebars.compile(html);
  return template(context);
}

function postProcess(html, summary, optimization, recommendation) {
  var $ = cheerio.load(html);
  $('#summaryTextarea').text(summary);
  $('#optimizationTextarea').text(optimization);
  $('#recommendationTextarea').text(recommendation);
  $('#createPdfButton').remove();
  return $.html();
}

module.exports = pdfGenerator;

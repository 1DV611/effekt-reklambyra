var fs = require('fs');
var handlebars = require('handlebars');
var inline = require('inline-source');
var path = require('path');
var cheerio = require('cheerio');

//  var streamPdf = htmlPdf;
var streamPdf = phantomHtmlToPdf;

var getReportAndDataByMonthAndYear = require('./../server/databaseOperations/Report/getReportAndDataByMonthAndYear');
var monthToNumber = require('./helpers/monthToNumber.js');

function pdfGenerator(user, query, month, year, summary, optimization, recommendation, res) {
  getReportAndDataByMonthAndYear(user, query, monthToNumber(month), year).then(function(context) {
    fs.readFile('./views/preview.handlebars', 'utf-8', function (err, data) {
      var template = handlebars.compile(data);
      var html = template(context);
      var external_refs = " \
        <link inline href='css/light-bootstrap-dashboard.css'> \
        <link inline href='css/toogle-switch.css'> \
        <link inline href='css/style.css'> \
        <script inline src='js/lib/charts/createChart.js'></script> \
        <script inline src='js/lib/charts/createData.js'></script> \
      ";
      inline(external_refs, { rootpath: path.resolve('client') }, function (err, inlines) {
        res.setHeader('Content-disposition', 'attachment; filename=rapport.pdf');
        res.setHeader('Content-type', 'application/pdf');
        var $ = cheerio.load(inlines+html);
        $('#summaryTextarea').text(summary);
        $('#optimizationTextarea').text(optimization);
        $('#recommendationTextarea').text(recommendation);
        $('#createPdfButton').remove();
        streamPdf($.html(), res);
      });
    });
  });
}

function htmlPdf(html, res) {
  var pdf = require('html-pdf');
  var config = {
    orientation: 'landscape'
  };
  pdf.create(html, config).toStream(function(err, stream) {
    stream.pipe(res);
  });
}

function phantomHtmlToPdf(html, res) {
  var pdf2 = require('phantom-html-to-pdf')();
  var config = {
    html: '<head><meta charset="utf-8" /></head>' + html,
    paperSize: {
      orientation: 'landscape'
    }
  };
  pdf2(config, function(err, f) { //  TODO:  TypeError: Cannot read property 'stream' of undefined
    f.stream.pipe(res);
  });
}

module.exports = pdfGenerator;

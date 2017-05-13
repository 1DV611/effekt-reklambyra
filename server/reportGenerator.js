var fs = require('fs');
var handlebars = require('handlebars');
var inline = require('inline-source');
var path = require('path');

//  var streamPdf = htmlPdf;
var streamPdf = phantomHtmlToPdf;

function reportGenerator(req, res, next) {
  var context = { form: req.app.locals.reportConfig };
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
      streamPdf(inlines+html, res);
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
  pdf2(config, function(err, f) {
    f.stream.pipe(res);
  });
}

module.exports = reportGenerator;

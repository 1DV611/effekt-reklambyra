var fs = require('fs');
var handlebars = require('handlebars');
var pdf = require('html-pdf');
var inline = require('inline-source');
var path = require('path');

function reportGenerator(req, res, next) {
  var context = {form : req.app.locals.reportConfig };
  fs.readFile('./views/preview.handlebars', 'utf-8', function (err, data) {
    var template = handlebars.compile(data);
    var html = template(context);
    var pdfconfig = {
      orientation: 'landscape'
    };
    var external_refs = " \
        <link inline href='css/light-bootstrap-dashboard.css'> \
        <link inline href='css/toogle-switch.css'> \
        <link inline href='css/style.css'> \
        <script inline src='js/lib/charts/createChart.js'></script> \
        <script inline src='js/lib/charts/createData.js'></script> \
    ";
    inline(external_refs, { rootpath: path.resolve('client') }, function (err, inlines) {
      pdf.create(inlines+html, pdfconfig).toStream(function(err, stream) {
        res.setHeader('Content-disposition', 'attachment; filename=rapport.pdf');
        res.setHeader('Content-type', 'application/pdf');
        stream.pipe(res);
      });
    });
  });
}
module.exports = reportGenerator;

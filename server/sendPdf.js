function sendPdf(source, res) {
  if (source == undefined) {
    throw new Error('sendPdf: Can\'t produce pdf. Source is undefined.');
  }
  var renderer = phantomHtmlToPdf;
  return renderer(source, res)
}

function htmlPdf(html, res) {
  return new Promise(function(resolve, reject) {
    var pdf = require('html-pdf');
    var config = {
      orientation: 'landscape'
    };
    pdf.create(html, config).toStream(function(err, stream) {
      if (err) {
        reject('htmlPdf(): Failed to produce pdf:');
        return;
      }
      setHeaders(res);
      stream.pipe(res);
    });
  });
}

function phantomHtmlToPdf(html, res) {
  return new Promise(function(resolve, reject) {
    var pdf = require('phantom-html-to-pdf')();
    var config = {
      html: '<head><meta charset="utf-8" /></head>' + html,
      paperSize: {
        orientation: 'landscape'
      }
    }
    pdf(config, function(err, f) {
      if (err) {
        reject('phantomHtmlToPdf(): Failed to produce pdf:');
        return;
      }
      setHeaders(res);
      f.stream.pipe(res);
    });
  });
}

function setHeaders(res) {
      res.setHeader('Content-disposition', 'attachment; filename=rapport.pdf');
      res.setHeader('Content-type', 'application/pdf');
}

module.exports = sendPdf;


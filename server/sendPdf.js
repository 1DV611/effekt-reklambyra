/*
 * Tar emot en kombination av html, css och javascript, skapar en pdf-data-ström som sedan skickas via response-objektet.
 */
function sendPdf(source, res) {
  if (source == undefined) {
    throw new Error('sendPdf: Can\'t produce pdf. Source is undefined.');
  }

  // Valbara pdf-konverteringsfunktioner:
  // - htmlPdf
  // - phantomHtmlToPdf
  var converter = phantomHtmlToPdf;

  return converter(source, res)
}

/*
 * Konvertera till pdf med paketet html-pdf
 * Skicka sedan resultatet
 */
function htmlPdf(html, res) {

  return new Promise(function(resolve, reject) {
    var pdf = require('html-pdf');
    var config = {
      // orientation: 'landscape'
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

/*
 * Konvertera till pdf med paketet phantom-html-to-pdf
 * Skicka sedan resultatet
 */
function phantomHtmlToPdf(html, res) {
  return new Promise(function(resolve, reject) {
    var pdf = require('phantom-html-to-pdf')();
    var config = {
      html: '<head><meta charset="utf-8" /></head>' + html,
      paperSize: {
        // orientation: 'landscape'
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

/*
 * Presentera response-datan som pdf för klienten
 */
function setHeaders(res) {
      res.setHeader('Content-disposition', 'attachment; filename=rapport.pdf');
      res.setHeader('Content-type', 'application/pdf');
}

module.exports = sendPdf;


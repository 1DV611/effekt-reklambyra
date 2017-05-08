
function resultsFromGoogleApi(req, res, next) {
  res.render('example', { user: req.user,
    results: {
      youtubeViews: 282756,
      analytics: {
        analyticsViews: '218079',
        analyticsUniqueViews: '167327',
        analyticsStrongestRedirects: '',
        analyticsMostVisitedPages: '',
        analyticsAverageTime: '90.49878589101789',
        analyticsAverageVisitedPerPages: '2.5096841015018123'
      }
    }
  });
}

module.exports = resultsFromGoogleApi;

a
function addGoogleResultsToFormObject(form, results) {

  if (form.youtube.active === 'on') {
    if (form.youtube.features.youtubeViews.active === 'on' && results.youtubeViews) {
      form.youtube.features.youtubeViews.result = results.youtubeViews;
    }
  }

  if (form.analytics.active === 'on') {
    if (form.analytics.features.analyticsViews.active === 'on' && results.analytics.analyticsViews) {
      form.analytics.features.analyticsViews.result = results.analytics.analyticsViews;
    }
    if (form.analytics.features.analyticsUniqueViews.active === 'on' && results.analytics.analyticsUniqueViews) {
      form.analytics.features.analyticsUniqueViews.result = results.analytics.analyticsUniqueViews;
    }
    if (form.analytics.features.analyticsStrongestRedirects.active === 'on' && results.analytics.analyticsStrongestRedirects) {
      form.analytics.features.analyticsStrongestRedirects.result = results.analytics.analyticsStrongestRedirects;
    }
    if (form.analytics.features.analyticsMostVisitedPages.active === 'on' && results.analytics.analyticsMostVisitedPages) {
      form.analytics.features.analyticsMostVisitedPages.result = results.analytics.analyticsMostVisitedPages;
    }
    if (form.analytics.features.analyticsAverageTime.active === 'on' && results.analytics.analyticsAverageTime) {
      form.analytics.features.analyticsAverageTime.result = results.analytics.analyticsAverageTime;
    }
    if (form.analytics.features.analyticsAverageVisitedPerPages.active === 'on' && results.analytics.analyticsAverageVisitedPerPages) {
      form.analytics.features.analyticsAverageVisitedPerPages.result = results.analytics.analyticsAverageVisitedPerPages;
    }
  }

};


module.exports = addGoogleResultsToFormObject;

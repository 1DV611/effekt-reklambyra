
function addGoogleResultsToFormObject(form, results) {

  if (form.youtube.active === 'on') {
    if (form.youtube.features.youtubeViews.active === 'on' && results.youtube.views) {
      form.youtube.features.youtubeViews.result = results.youtube.views;
    }
  }

  if (form.analytics.active === 'on') {
    if (form.analytics.features.analyticsViews.active === 'on' && results.analytics.views) {
      form.analytics.features.analyticsViews.result = results.analytics.views;
    }
    if (form.analytics.features.analyticsUniqueViews.active === 'on' && results.analytics.uniqueViews) {
      form.analytics.features.analyticsUniqueViews.result = results.analytics.uniqueViews;
    }
    if (form.analytics.features.analyticsStrongestRedirects.active === 'on' && results.analytics.strongestRedirects) {
      form.analytics.features.analyticsStrongestRedirects.result = results.analytics.strongestRedirects;
    }
    if (form.analytics.features.analyticsMostVisitedPages.active === 'on' && results.analytics.mostVisitedPages) {
      form.analytics.features.analyticsMostVisitedPages.result = results.analytics.mostVisitedPages;
    }
    if (form.analytics.features.analyticsAverageTime.active === 'on' && results.analytics.averageTime) {
      form.analytics.features.analyticsAverageTime.result = results.analytics.averageTime;
    }
    if (form.analytics.features.analyticsAverageVisitedPerPages.active === 'on' && results.analytics.averageVisitedPerPages) {
      form.analytics.features.analyticsAverageVisitedPerPages.result = results.analytics.averageVisitedPerPages;
    }

    form.visitorsInTotalLastThreeMonths = [results.analytics.viewsPreviousMonth2, results.analytics.viewsPreviousMonth, results.analytics.views];

    //percentage views
    let totalViews = Number(results.youtube.views) + Number(results.analytics.views);
    let youtubePercentage = (results.youtube.views * 100) / totalViews;
    let analyticsPercentage = (results.analytics.views * 100) / totalViews;
    form.youtube.percentage = Math.round(youtubePercentage * 10) / 10;
    form.analytics.percentage = Math.round(analyticsPercentage * 10) / 10;
  }
};


module.exports = addGoogleResultsToFormObject;

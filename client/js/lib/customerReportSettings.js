const googleAPI = require('./../../../model/APIs/googleAPI');
const addGoogleResultsToFormObject = require('./addGoogleResultsToFormObject');

var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
];

function customerReportSettings(req, res, next) {

  var monthBeforePreviousMonth;
  var previousMonth;
  var month = req.body.month;
  if (month === "0") {
    previousMonth = 11;
    monthBeforePreviousMonth = 10;
  } else if (month === "1") {
    previousMonth = 0;
    monthBeforePreviousMonth = 11;
  } else {
    previousMonth = (month - 1);
    monthBeforePreviousMonth = (month - 2);
  }

  var form = {

    customer: req.body.customer || 'Customer',
    month: months[month],
    year: req.body.year,
    interval: [months[monthBeforePreviousMonth], months[previousMonth], months[month]],
    visitorsInTotalLastThreeMonths: [1000, 2000, 3000],
    adwords: {
      title: 'AdWords',
      percentage: 50,
      active: req.body.adwords,
      features: {
        adwordsClick: {
          active: req.body.adwordsClick,
          result: '*Data*',
          description: ' klickningar.',
        },
        adwordsCpc: {
          active: req.body.adwordsCpc,
          result: '*Data*',
          description: ' kostnad per klick.',
        },
        adwordsViews: {
          active: req.body.adwordsViews,
          result: '*Data*',
          description: ' visningar.',
        },
      },
    },
    facebook: {
      title: 'Facebook',
      percentage: 50,
      active: req.body.facebook,
      features: {
        facebookLikes: {
          active: req.body.facebookLikes,
          result: '*Data*',
          description: ' gillningar.',
        },
      },
    },
    youtube: {
      title: 'YouTube',
      percentage: 50,
      active: req.body.youtube,
      features: {
        youtubeViews: {
          active: req.body.youtubeViews,
          result: '*Data*',
          description: ' visningar.',
        },
      },
    },
    tynt: {
      title: 'Tynt',
      percentage: 50,
      active: req.body.tynt,
      features: {
        tyntCopied: {
          active: req.body.tyntCopied,
          result: '*Data*',
          description: ' kopieringar.',
        },
      },
    },
    addthis: {
      title: 'AddThis',
      percentage: 50,
      active: req.body.addthis,
      features: {
        addthisClick: {
          active: req.body.addthisClick,
          result: '*Data*',
          description: ' klickningar.',
        },
      },
    },
    twitter: {
      title: 'Twitter',
      percentage: 50,
      active: req.body.twitter,
      features: {
        twitterViews: {
          active: req.body.twitterViews,
          result: '*Data*',
          description: ' visningar.',
        },
      },
    },
    analytics: {
      title: 'Analytics',
      percentage: 50,
      active: req.body.analytics,
      features: {
        analyticsViews: {
          active: req.body.analyticsViews,
          result: '*Data*',
          description: ' visningar.',
        },
        analyticsUniqueViews: {
          active: req.body.analyticsUniqueViews,
          result: '*Data*',
          description: ' unika visningar.',
        },
        analyticsStrongestRedirects: {
          active: req.body.analyticsStrongestRedirects,
          result: '*Data*',
          description: ' är de starkaste ingångskanalerna.',
        },
        analyticsMostVisitedPages: {
          active: req.body.analyticsMostVisitedPages,
          result: '*Data*',
          description: ' är de mest besökta sidorna.',
        },
        analyticsAverageTime: {
          active: req.body.analyticsAverageTime,
          result: '*Data*',
          description: ' genomsnittlig tid på sidan.',
        },
        analyticsAverageVisitedPerPages: {
          active: req.body.analyticsAverageVisitedPerPages,
          result: '*Data*',
          description: ' genomsnittligt antal besökta sidor.',
        },
      },
    },
    linkedin: {
      title: 'LikedIn',
      percentage: 50,
      active: req.body.linkedin,
      features: {
        linkedinFollowers: {
          active: req.body.linkedinFollowers,
          result: '*Data*',
          description: ' följare.',
        },
        linkedinInteractions: {
          active: req.body.linkedinInteractions,
          result: '*Data*',
          description: ' interaktioner.',
        },
      },
    },
    moz: {
      title: 'Moz',
      percentage: 50,
      active: req.body.moz,
      features: {
        mozKeywords: {
          active: req.body.mozKeywords,
          result: '*Data*',
          description: ' nyckelord.',
        },
      },
    },
  };

  // Make the stats available for the report generator
  req.app.locals.reportConfig = form;

  res.render('preview', { user: req.user, form: form });

}

module.exports = customerReportSettings;

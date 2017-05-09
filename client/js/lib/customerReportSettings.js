const googleAPI = require('./../../../model/APIs/googleAPI');
const addGoogleResultsToFormObject = require('./addGoogleResultsToFormObject');

var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
];

var monthBeforePrevious = ((new Date().getMonth() - 2) % 12);
var previousMonth = ((new Date().getMonth() - 1) % 12);

function customerReportSettings(req, res, next) {
  var form = {

    customer: req.body.customer || 'Customer',
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    interval: [months[monthBeforePrevious], months[previousMonth], months[new Date().getMonth()]],
    visitorsInTotalLastThreeMonths: [1000, 2000, 3000],
    adwords: {
      title: 'AdWords',
      percentage: 50,
      active: req.body.adwords,
      features: {
        adwordsClick: {
          active: req.body.adwordsClick,
          result: '',
        },
        adwordsCpc: {
          active: req.body.adwordsCpc,
          result: '',
        },
        adwordsViews: {
          active: req.body.adwordsViews,
          result: '',
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
          result: '',
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
          result: '',
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
          result: '',
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
          result: '',
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
          result: '',
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
          result: '',
        },
        analyticsUniqueViews: {
          active: req.body.analyticsUniqueViews,
          result: '',
        },
        analyticsStrongestRedirects: {
          active: req.body.analyticsStrongestRedirects,
          result: '',
        },
        analyticsMostVisitedPages: {
          active: req.body.analyticsMostVisitedPages,
          result: '',
        },
        analyticsAverageTime: {
          active: req.body.analyticsAverageTime,
          result: '',
        },
        analyticsAverageVisitedPerPages: {
          active: req.body.analyticsAverageVisitedPerPages,
          result: '',
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
          result: '',
        },
        linkedinInteractions: {
          active: req.body.linkedinInteractions,
          result: '',
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
          result: '',
        },
      },
    },
  };

  res.render('preview', { user: req.user, form: form });

}

module.exports = customerReportSettings;

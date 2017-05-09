const googleAPI = require('./../../../model/APIs/googleAPI');
const addGoogleResultsToFormObject = require('./addGoogleResultsToFormObject');

function customerReportSettings(req, res, next) {
  var form = {

    customer: req.body.customer || 'Customer',
    adwords: {
      title: 'AdWords',
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

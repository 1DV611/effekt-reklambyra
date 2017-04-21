function customerReportSettings(req, res, next) {
  var form = {
    customer: req.body.customer || 'Kund',
    adwords: {
      name: 'Adwords',
      active: req.body.adwords,
      features: {
        adwordsClick: req.body.adwordsClick,
        adwordsCpc: req.body.adwordsCpc,
        adwordsViews: req.body.adwordsViews,
      },
    },
    facebook: {
      name: 'Facebook',
      active: req.body.facebook,
      features: {
        facebookLikes: req.body.facebookLikes,
      },
    },
    youtube: {
      name: 'Youtube',
      active: req.body.youtube,
      features: {
        youtubeViews: req.body.youtubeViews,
      },
    },
    tynt: {
      name: 'Tynt',
      active: req.body.tynt,
      features: {
        tyntCopied: req.body.tyntCopied,
      },
    },
    addthis: {
      name: 'Addthis',
      active: req.body.addthis,
      features: {
        addthisClick: req.body.addthisClick,
      },
    },
    twitter: {
      name: 'Twitter',
      active: req.body.twitter,
      features: {
        twitterViews: req.body.twitterViews,
      },
    },
    analytics: {
      name: 'Analytics',
      active: req.body.analytics,
      features: {
        analyticsViews: req.body.analyticsViews,
        analyticsUniqueViews: req.body.analyticsUniqueViews,
        analyticsStrongestRedirects: req.body.analyticsStrongestRedirects,
        analyticsMostVisitedPages: req.body.analyticsMostVisitedPages,
        analyticsAverageTime: req.body.analyticsAverageTime,
        analyticsAverageVisitedPerPages: req.body.analyticsAverageVisitedPerPages,
      },
    },
    linkedin: {
      name: 'Linkedin',
      active: req.body.linkedin,
      features: {
        linkedinFollowers: req.body.linkedinFollowers,
        linkedinInteractions: req.body.linkedinInteractions,
      },
    },
    moz: {
      name: 'Moz',
      active: req.body.moz,
      features: {
        mozKeywords: req.body.mozKeywords,
      },
    },
  };

  res.render('preview', { user: req.user, form: form });
}

module.exports = customerReportSettings;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true,
  },

  displayName: {
    type: String,
    required: true,
    unique: true,
  },

  google: {
    type: Object,
  },

  instagram: {
    type: Object,
  },

  linkedin: {
    type: Object,
  },

  twitter: {
    type: Object,
  },

  facebook: {
    type: Object,
  },

});

var user = mongoose.model('user', userSchema);

var dataSchema = new mongoose.Schema({

  //todo restrict month being 1-12 and year being 4 digits?
  customerReference: [{ type: Schema.Types.ObjectId, ref: 'customer', required: true }],
  month: { type: Number, required: true },
  year: { type: Number, required: true },

  adwords: {
    adwordsClick: Number,
    adwordsCpc: Number,
    adwordsViews: Number,
  },

  facebook: {
    facebookLikes: Number,
  },

  youtube: {
    youtubeViews: Number,
  },

  twitter: {
    twitterFollowers: Number,
  },

  analytics: {
    views: Number,
    uniqueVies: Number,
    strongestRedirects: Number,
    mostVisitedPages: Number,
    averageTime: Number,
    averageVisitedPerPages: Number,
  },

  linkedin: {
    followers: Number,
    interactions: Number,
  },

  moz: {
    keywords: Array,
  },
});


/**
 *
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
 */

var apiData = mongoose.model('apiData', dataSchema);

exports.user = user;
exports.apiData = apiData;

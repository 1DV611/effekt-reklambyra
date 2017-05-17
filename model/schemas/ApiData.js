var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var handleDuplicateKeyError = require('./../../server/helpers/handleDuplicateKeyError');
var Schema = mongoose.Schema;
var ApiData;

const ApiDataSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now },
  updated: { type: Date },
  report: {
    type: Schema.Types.ObjectId,
    ref: 'Report',
    required: [true, 'A report reference is required!'] },
  adwords: {
    adwordsClick: { type: Number },
    adwordsCpc: { type: Number },
    adwordsViews: { type: Number }
  },
  facebook: {
    facebookLikes: { type: Number }
  },
  youtube: {
    youtubeViews: { type: Number }
  },
  tynt: {
    tyntCopied: { type: Number } // TODO: Array? String?
  },
  addthis: {
    addthisClick: { type: Number }
  },
  twitter: {
    twitterViews: { type: Number }
  },
  analytics: {
    analyticsViews: { type: Number },
    analyticsUniqueViews: { type: Number },
    analyticsStrongestRedirects: { type: String }, // TODO: Array?
    analyticsMostVisitedPages: { type: Number },
    analyticsAverageTime: { type: Number },
    analyticsAverageVisitedPerPages: { type: Number }
  },
  linkedin: {
    linkedinFollowers: { type: Number },
    linkedinInteractions: { type: Number }
  },
  moz: {
    mozKeywords: { type: Array }
  } // TODO: Instagram?
});

ApiDataSchema.post('save', handleDuplicateKeyError);
ApiDataSchema.post('update', handleDuplicateKeyError);
ApiDataSchema.post('findOneAndUpdate', handleDuplicateKeyError);

ApiDataSchema.plugin(idValidator);
ApiData = mongoose.model('ApiData', ApiDataSchema);
module.exports = ApiData;

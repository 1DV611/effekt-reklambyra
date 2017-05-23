var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var handleDuplicateKeyError = require('./../../helpers/handleDuplicateKeyError');
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
  adwords: { type: Object },
  facebook: { type: Object },
  youtube: { type: Object },
  tynt: { type: Object },
  addthis: { type: Object },
  twitter: { type: Object },
  analytics: { type: Object },
  linkedin: { type: Object },
  moz: { type: Object }
  // TODO: Instagram?
});

ApiDataSchema.post('save', handleDuplicateKeyError);
ApiDataSchema.post('update', handleDuplicateKeyError);
ApiDataSchema.post('findOneAndUpdate', handleDuplicateKeyError);

ApiDataSchema.plugin(idValidator);
ApiData = mongoose.model('ApiData', ApiDataSchema);
module.exports = ApiData;

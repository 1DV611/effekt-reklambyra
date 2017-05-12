var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var Report;

const ReportSchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  updated: { type: Date },
  user: {
    type: Schema.Types.profileId,
    ref: 'User',
    justOne: true,
    required: [true, 'An user reference is required!'] },
  summary: {
    type: String
  },
  optimization: {
    type: String
  },
  recommendation: {
    type: String
  }
});

ReportSchema.plugin(idValidator);
Report = mongoose.model('Report', ReportSchema);
module.exports = Report;

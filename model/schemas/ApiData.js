var mongoose = require('mongoose');
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var ApiData;

const ApiDataSchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  updated: { type: Date },
  report: {
    type: Schema.Types.ObjectId,
    ref: 'Report',
    required: [true, 'A report reference is required!'] },
  data: {
    type: Object,
    required: [true, 'Data is required!']
  }
});

ApiDataSchema.plugin(idValidator);
ApiData = mongoose.model('ApiData', ApiDataSchema);
module.exports = ApiData;

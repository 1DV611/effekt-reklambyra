var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ApiAccess;

const ApiAccessSchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  updated: { type: Date },
  user: {
    type: Schema.Types.String,
    ref: 'User',
    justOne: true,
    unique: [true, 'User already has ApiAccess!'],
    required: [true, 'An user reference is required!'] },
  google: {
    type: Object
  },
  instagram: {
    type: Object
  },
  linkedin: {
    type: Object
  },
  twitter: {
    type: Object
  },
  facebook: {
    type: Object
  }
});

ApiAccess = mongoose.model('ApiAccess', ApiAccessSchema);
module.exports = ApiAccess;

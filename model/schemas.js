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
    type: String,
  },

  instagram: {
    type: String,
  },

  linkedin: {
    type: String,
  },

  twitter: {
    type: String,
  },

  facebook: {
    type: String,
  },

});

var user = mongoose.model('user', userSchema);

exports.user = user;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  authZeroAccessToken: {
    type: String,
    required: true,
    unique: true,
  },

  facebookToken: {
    type: String,
  },

  googleToken: {
    type: String,
  },

  instagramToken: {
    type: String,
  },

  linkedinToken: {
    type: String,
  },

  twitterToken: {
    type: String,
  },

});

var user = mongoose.model('user', userSchema);

exports.user = user;

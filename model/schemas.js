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


});


var data = mongoose.model('apiData', dataSchema);

exports.user = user;

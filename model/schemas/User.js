var mongoose = require('mongoose');
var handleDuplicateKeyError = require('./../../server/helpers/handleDuplicateKeyError');
var Schema = mongoose.Schema;
var User;

const UserSchema = new Schema({
  profileId: {
    type: String,
    unique: [true, 'Profile id is already registered!'], // Is this set in Auth0?
    required: [true, 'A profile id is required!']
  },
  displayName: {
    type: String,
    unique: [true, 'Display name is already registered!'], // Is this set in Auth0?
    required: [true, 'A display name is required!'] //  Is this set in Auth0?
  },
  admin: {
    type: Boolean,
    required: [true, 'User status must be entered!']
  }
});

UserSchema.post('save', handleDuplicateKeyError);
UserSchema.post('update', handleDuplicateKeyError);
UserSchema.post('findOneAndUpdate', handleDuplicateKeyError);

User = mongoose.model('User', UserSchema);
module.exports = User;

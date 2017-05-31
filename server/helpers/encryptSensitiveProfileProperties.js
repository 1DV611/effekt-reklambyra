'use strict';

// lägg till egenskaper som ni vill ha krypterade här
var propertiesToEncrypt = ['username', 'password', 'pubID', 'secret_api_key', 'site_guid', 'accessToken', 'access_token', 'refreshToken', 'refresh_token', 'id_token'];
var encrypt = require('./encrypt');

/**
 * Krypterar de properties som fins i propertiesToEncrypt, sparar alla andra properties på
 * profilen okrypterat.
 */
module.exports = function (profile) {
  var access = {};

  for (var property in profile) {

    if (propertiesToEncrypt.indexOf(property) > 0) {

      access[property] = encrypt.encryptText(profile[property]);

    } else {

      // Då accessTokens etc även ibland ligger under extra Params går vi även igenom den
      if (property === 'extraParams') {

        for (var subProperty in profile['extraParams']) {

          if (propertiesToEncrypt.indexOf(subProperty) > 0) {
            profile['extraParams'][subProperty] = encrypt.encryptText(profile['extraParams'][subProperty])
          }
        }

      }

      access[property] = profile[property]
    }
  }

  return access;
};
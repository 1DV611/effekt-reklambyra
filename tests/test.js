var webdriverio = require('webdriverio');
var mocha = require('mocha');
var assert = require('assert');

// Populate process.env
require('dotenv').config();

var baseUrl = 'http://localhost:3000/';

var options = {
  desiredCapabilities: {
    browserName: 'firefox'
  }
};

describe('first page', function () {
  it('should have the same title as effectreklam.se', function () {
    browser.url(baseUrl);
    browser.getTitle().should.be.equal('Effect Reklambyrå');
  });
});

describe('admin', function () {
  it('should able to login', function () {
    browser.url(baseUrl + 'login');
    browser.waitForVisible('.auth0-lock-input-email', 5000);
    var email = $('.auth0-lock-input-email .auth0-lock-input');
    email.setValue(process.env.AUTH0_ADMIN_EMAIL);
    var password = $('.auth0-lock-input-password .auth0-lock-input');
    password.setValue(process.env.AUTH0_ADMIN_PASSWORD);
    var submit = $('.auth0-lock-submit');
    submit.click();
    browser.waitForVisible('.profile-picture', 5000);
    browser.getUrl().should.be.equal(baseUrl + 'user');
  });
});

var webdriverio = require('webdriverio');
var mocha = require('mocha');
var assert = require('assert');

// Hämta process.env
require('dotenv').config();

var baseUrl = 'http://localhost:3000/';

var options = {
  desiredCapabilities: {
    browserName: 'firefox',
  },
};

describe('not authenticated user', function () {
  it('accessing /user should get redirected to /login', function () {
    browser.url(baseUrl + 'user');
    browser.waitUntil(function () {
      return browser.getUrl().should.be.equal(baseUrl + 'login');
    });
  });

  it('accessing /user/dashboard should get redirected to /login', function () {
    browser.url(baseUrl + 'user/dashboard');
    browser.waitUntil(function () {
      return browser.getUrl().should.be.equal(baseUrl + 'login');
    });
  });

  it('accessing /user/reports should get redirected to /login', function () {
    browser.url(baseUrl + 'user/reports');
    browser.waitUntil(function () {
      return browser.getUrl().should.be.equal(baseUrl + 'login');
    });
  });
});

describe('user', function () {
  it('should recieve an error message when entering bad credentials', function () {
    browser.url(baseUrl + 'login');
    browser.waitForVisible('.auth0-lock-input-email', 5000);
    var email = $('.auth0-lock-input-email .auth0-lock-input');
    email.setValue('user@example.com');
    var password = $('.auth0-lock-input-password .auth0-lock-input');
    password.setValue('asdf');
    var submit = $('.auth0-lock-submit');
    submit.click();
    browser.waitForVisible('.auth0-global-message', 5000);
    $('.auth0-global-message span span').getText().should.be.equal('WRONG EMAIL OR PASSWORD.');
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
    browser.getUrl().should.contain(baseUrl + 'user');
  });
});


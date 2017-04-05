var webdriverio = require('webdriverio');
var mocha = require('mocha');
var assert = require('assert');

var options = {
    desiredCapabilities: {
        browserName: 'firefox',
      },
  };

describe('first page', function () {
    it('have the same title as effectreklam.se', function () {
        browser.url('http://localhost:3000');
        browser.getTitle().should.be.equal('Effect Reklambyrå');
      });
  });

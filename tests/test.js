var webdriverio = require('webdriverio');
var mocha = require('mocha');
var assert = require('assert');

var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

describe('my awesome website', function() {
    it('should do some chai assertions', function() {
        browser.url('http://webdriver.io');
        browser.getTitle().should.be.equal('blah');
    });
});

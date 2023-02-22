'use strict';

/* eslint-env jasmine */

var wd = require('yiewd');
var colors = require('colors');
var expect = require('chai').expect;
var f = require('util').format;
var env = process.env;

var browser;
var caps;

browser = (process.env.BROWSER || 'chrome').split(':');

caps = {
  name: f('[%s] typeahead.js ui', browser.join(' , ')),
  browserName: browser[0]
};

setIf(caps, 'version', browser[1]);
setIf(caps, 'platform', browser[2]);
setIf(caps, 'tunnel-identifier', env['TRAVIS_JOB_NUMBER']);
setIf(caps, 'build', env['TRAVIS_BUILD_NUMBER']);
setIf(caps, 'tags', env['CI'] ? ['CI'] : ['local']);

function setIf(obj, key, val) {
  val && (obj[key] = val);
}

describe('jquery-typeahead.js', function() {
  var driver;
  var body;
  var input;
  var hint;
  var dropdown;
  var allPassed = true;

  this.timeout(300000);

  before(function(done) {
    var host = 'ondemand.saucelabs.com';
    var port = 80;
    var username;
    var password;

    if (env['CI']) {
      host = 'localhost';
      port = 4445;
      username = env['SAUCE_USERNAME'];
      password = env['SAUCE_ACCESS_KEY'];
    }

    driver = wd.remote(host, port, username, password);
    driver.configureHttp({
      timeout: 30000,
      retries: 5,
      retryDelay: 200
    });

    driver.on('status', function(info) {
      console.log(info.cyan);
    });

    driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth.yellow, path.grey, data || '');
    });

    driver.run(function*() {
      yield this.init(caps);
      yield this.get((env['TEST_HOST'] || 'http://localhost:8080') + '/test/integration/test.html');

      body = this.elementByTagName('body');
      input = yield this.elementById('states');
      hint = yield this.elementByClassName('aa-hint');
      dropdown = yield this.elementByClassName('aa-dropdown-menu');

      done();
    });
  });

  beforeEach(function(done) {
    driver.run(function*() {
      yield body.click();
      yield this.execute('$("#states").autocomplete("val", "")');
      done();
    });
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function(done) {
    driver.run(function*() {
      yield this.quit();
      yield driver.sauceJobStatus(allPassed);
      done();
    });
  });

  function testSuite () {
    describe('on blur', function() {
      it('should close dropdown', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');
          expect(yield dropdown.isDisplayed()).to.equal(true);

          yield body.click();
          expect(yield dropdown.isDisplayed()).to.equal(false);

          done();
        });
      });

      it('should clear hint', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');
          expect(yield hint.getValue()).to.equal('michigan');

          yield body.click();
          expect(yield hint.getValue()).to.equal('');

          done();
        });
      });
    });

    describe('on query change', function() {
      it('should open dropdown if suggestions', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');

          expect(yield dropdown.isDisplayed()).to.equal(true);

          done();
        });
      });

      it('should position the dropdown correctly', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');

          var inputPos = yield input.getLocation();
          var dropdownPos = yield dropdown.getLocation();

          expect(inputPos.x >= dropdownPos.x - 2 && inputPos.x <= dropdownPos.x + 2).to.equal(true);
          expect(dropdownPos.y > inputPos.y).to.equal(true);

          done();
        });
      });

      it('should close dropdown if no suggestions', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('huh?');

          expect(yield dropdown.isDisplayed()).to.equal(false);

          done();
        });
      });

      it('should render suggestions if suggestions', function(done) {
        driver.run(function*() {
          var suggestions;

          yield input.click();
          yield input.type('mi');

          suggestions = yield dropdown.elementsByClassName('aa-suggestion');

          expect(suggestions).to.have.length('4');
          expect(yield suggestions[0].text()).to.equal('Michigan');
          expect(yield suggestions[1].text()).to.equal('Minnesota');
          expect(yield suggestions[2].text()).to.equal('Mississippi');
          expect(yield suggestions[3].text()).to.equal('Missouri');

          done();
        });
      });

      it('should show hint if top suggestion is a match', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');

          expect(yield hint.getValue()).to.equal('michigan');

          done();
        });
      });

      it('should not show hint if top suggestion is not a match', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('ham');

          expect(yield hint.getValue()).to.equal('');

          done();
        });
      });

      it('should not show hint if there is query overflow', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('this is a very long value so deal with it otherwise');

          expect(yield hint.getValue()).to.equal('');

          done();
        });
      });
    });

    describe('on up arrow', function() {
      it('should cycle through suggestions', function(done) {
        driver.run(function*() {
          var suggestions;

          yield input.click();
          yield input.type('mi');

          suggestions = yield dropdown.elementsByClassName('aa-suggestion');

          yield input.type(wd.SPECIAL_KEYS['Up arrow']);
          expect(yield input.getValue()).to.equal('Missouri');
          expect(yield suggestions[3].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Up arrow']);
          expect(yield input.getValue()).to.equal('Mississippi');
          expect(yield suggestions[2].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Up arrow']);
          expect(yield input.getValue()).to.equal('Minnesota');
          expect(yield suggestions[1].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Up arrow']);
          expect(yield input.getValue()).to.equal('Michigan');
          expect(yield suggestions[0].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Up arrow']);
          expect(yield input.getValue()).to.equal('mi');
          expect(yield suggestions[0].getAttribute('class')).to.equal('aa-suggestion');
          expect(yield suggestions[1].getAttribute('class')).to.equal('aa-suggestion');
          expect(yield suggestions[2].getAttribute('class')).to.equal('aa-suggestion');
          expect(yield suggestions[3].getAttribute('class')).to.equal('aa-suggestion');

          done();
        });
      });
    });

    describe('on down arrow', function() {
      it('should cycle through suggestions', function(done) {
        driver.run(function*() {
          var suggestions;

          yield input.click();
          yield input.type('mi');

          suggestions = yield dropdown.elementsByClassName('aa-suggestion');

          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          expect(yield input.getValue()).to.equal('Michigan');
          expect(yield suggestions[0].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          expect(yield input.getValue()).to.equal('Minnesota');
          expect(yield suggestions[1].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          expect(yield input.getValue()).to.equal('Mississippi');
          expect(yield suggestions[2].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          expect(yield input.getValue()).to.equal('Missouri');
          expect(yield suggestions[3].getAttribute('class')).to.equal('aa-suggestion aa-cursor');

          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          expect(yield input.getValue()).to.equal('mi');
          expect(yield suggestions[0].getAttribute('class')).to.equal('aa-suggestion');
          expect(yield suggestions[1].getAttribute('class')).to.equal('aa-suggestion');
          expect(yield suggestions[2].getAttribute('class')).to.equal('aa-suggestion');
          expect(yield suggestions[3].getAttribute('class')).to.equal('aa-suggestion');

          done();
        });
      });
    });

    describe('on escape', function() {
      it('should close dropdown', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');
          expect(yield dropdown.isDisplayed()).to.equal(true);

          yield input.type(wd.SPECIAL_KEYS['Escape']);
          expect(yield dropdown.isDisplayed()).to.equal(false);

          done();
        });
      });

      it('should clear hint', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');
          expect(yield hint.getValue()).to.equal('michigan');

          yield input.type(wd.SPECIAL_KEYS['Escape']);
          expect(yield hint.getValue()).to.equal('');

          done();
        });
      });
    });

    describe('on tab', function() {
      it('should autocomplete if hint is present', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');

          yield input.type(wd.SPECIAL_KEYS['Tab']);
          expect(yield input.getValue()).to.equal('Michigan');

          done();
        });
      });

      it('should select if cursor is on suggestion', function(done) {
        driver.run(function*() {
          var suggestions;

          yield input.click();
          yield input.type('mi');

          suggestions = yield dropdown.elementsByClassName('aa-suggestion');
          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          yield input.type(wd.SPECIAL_KEYS['Tab']);

          expect(yield dropdown.isDisplayed()).to.equal(false);
          expect(yield input.getValue()).to.equal('Minnesota');

          done();
        });
      });
    });

    describe('on right arrow', function() {
      it('should autocomplete if hint is present', function(done) {
        driver.run(function*() {
          yield input.click();
          yield input.type('mi');

          yield input.type(wd.SPECIAL_KEYS['Right arrow']);
          expect(yield input.getValue()).to.equal('Michigan');

          done();
        });
      });
    });

    describe('on suggestion click', function() {
      it('should select suggestion', function(done) {
        if (browser[0] === 'firefox') {
          // crazy Firefox issue, skip it
          done();
          return;
        }
        driver.run(function*() {
          var suggestions;

          yield input.click();
          yield input.type('mi');

          suggestions = yield dropdown.elementsByClassName('aa-suggestion');
          yield suggestions[1].click();

          expect(yield dropdown.isDisplayed()).to.equal(false);
          expect(yield input.getValue()).to.equal('Minnesota');

          done();
        });
      });
    });

    describe('on enter', function() {
      it('should select if cursor is on suggestion', function(done) {
        driver.run(function*() {
          var suggestions;

          yield input.click();
          yield input.type('mi');

          suggestions = yield dropdown.elementsByClassName('aa-suggestion');
          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          yield input.type(wd.SPECIAL_KEYS['Down arrow']);
          yield input.type(wd.SPECIAL_KEYS['Return']);

          expect(yield dropdown.isDisplayed()).to.equal(false);
          expect(yield input.getValue()).to.equal('Minnesota');

          done();
        });
      });
    });
  }

  testSuite();
  describe('appendTo', function () {
    before('all', function*() {
      yield this.execute("buildAutocomplete({hint: false, appendTo: 'body'})");
    });

    testSuite();
  });
});

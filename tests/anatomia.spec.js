
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var anatomia;

var getFileContent = function (file) {
  return fs.readFileSync(file).toString('utf8');
}

suite('Basics', function() {

  beforeEach(function () {
    anatomia = require('../lib')();  
  });

  test('Tokenization', function() {
    var script = "var answer = 42; And invalid JavaScript here";
    var result = anatomia.tokensToString(anatomia.stringToTokens(script));
    expect(script).to.be.equal(result);
  });

  test.only('Using a middleware', function () {
    var script = "var something = 10; var answer/Validate/ = 'Jon Snow';\
    function test() { return 20; };\
    ";
    var middleware = {
      pattern: '@import test',
      match: function (params) {
        console.log(params);
      }
    }
    var result = anatomia.use(middleware).process(script);
    expect(script).to.be.equal(result);
  });

});
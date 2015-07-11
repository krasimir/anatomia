
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

  test.only('Using a middleware', function () {
    var script = "var something = 10; var answer/Validate/ = 'Jon Snow';\
    function test() { return 20; };\
    ";
    var result = anatomia.parse(script);
  });

});
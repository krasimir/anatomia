var assert = require('assert');
var _ = require('lodash');
var glob = require('glob');
var path = require('path');

suite.only('Instrumentor', function() {

  var anatomia = require('../lib')();

  glob(__dirname + '/data/instrumentor/*.js', {}, function(err, files) {
    _.forEach(files, function(f) {
      var name = path.basename(f);
      test(name.replace('.js', ''), function(done) {
        anatomia.instrumentor.processFile(f, function(err, anotated) {
          console.log('----------------', "\n", anotated);
          done();
        });
      });
    });
  });

});
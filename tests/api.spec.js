var assert = require('assert');
var _ = require('lodash');

suite('Core API', function() {

  test('> Is there API available', function(done) {
    var anatomia = require('../lib')();
    assert(typeof anatomia.version !== 'undefined');
    assert(anatomia.version(), 'string');
    done();
  });

  test('> translating', function(done) {
    var anatomia = require('../lib')();
    anatomia.translator.read([
      __dirname + '/data/app/**/*.js',
      __dirname + '/data/other/**/*.js',      
    ], function(err, trees) {
      assert.equal(err, null);
      assert(Array.isArray(trees));
      assert(trees.length > 0);
      assert(typeof trees[0].tree !== 'undefined');
      done();
    });
  });

  test.only('> finding', function(done) {
    var anatomia = require('../lib')();
    var searchFor = 'answer + addition;';
    anatomia.translator.read(__dirname + '/data/app/folder/module.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        var str = anatomia.translator.locToString(found[0].loc, item.source);
        assert.equal(searchFor, str);
        done();
      });
    });
  });

});
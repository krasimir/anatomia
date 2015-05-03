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

  test('> finding', function(done) {
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

  test('> finding multiline', function(done) {
    var anatomia = require('../lib')();
    var searchFor = 'var complex = function() {\n\
  return 2 + 2;\n\
}';
    anatomia.translator.read(__dirname + '/data/other/helper.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        assert.equal(err, null);
        var str = anatomia.translator.locToString(found[0].loc, item.source);
        assert.equal(searchFor, 'var ' + str); // the loc value doesn't include "var"
        done();
      });
    });
  });

  test('> finding in complex tree', function(done) {
    var anatomia = require('../lib')();
    var searchFor = 'self.fire()';
    anatomia.translator.read(__dirname + '/data/other/complex.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 6);
        done();
      });
    });
  });

});
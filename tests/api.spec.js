var assert = require('assert');
var _ = require('lodash');

suite('Core API', function() {

  var anatomia = require('../lib')();

  var displayFounds = function(found, source) {
    found.forEach(function(f) {
      console.log(toStr(f, source));
    });
  }
  var toStr = function(f, source) {
    return anatomia.translator.locToString(f.loc, source);
  }

  test('Is there API available', function(done) {
    assert(typeof anatomia.version !== 'undefined');
    assert(anatomia.version(), 'string');
    done();
  });

  test('translating', function(done) {
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

  test('finding', function(done) {
    var searchFor = 'answer + addition;';
    anatomia.translator.read(__dirname + '/data/app/folder/module.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        assert.equal(found.length, 1);
        var str = anatomia.translator.locToString(found[0].loc, item.source);
        assert.equal(searchFor, str);
        done();
      });
    });
  });

  test('finding multiline', function(done) {
    var searchFor = 'var complex = function() {\n\
      return 2 + 2;\n\
    }';
    anatomia.translator.read(__dirname + '/data/other/helper.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, { exact: false }, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 1);
        done();
      });
    });
  });

  test('finding in complex tree', function(done) {
    var searchFor = 'this.choices_count()';
    anatomia.translator.read(__dirname + '/data/other/chosen.proto.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, { exact: false }, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 121);
        done();
      });
    });
  });

  test('variable definition', function(done) {
    var searchFor = 'var something';
    anatomia.translator.read(__dirname + '/data/other/specific.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, { exact: false}, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 8);
        done();
      });
    });
  });

  test('function invocation', function(done) {
    var searchFor = 'method()';
    anatomia.translator.read(__dirname + '/data/other/specific.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, { exact: false}, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 5);
        // displayFounds(found, item.source);
        done();
      });
    });
  });

  test('specific function invocation', function(done) {
    var searchFor = 'f(\'nothing here\')';
    anatomia.translator.read(__dirname + '/data/other/specific.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 1);
        // displayFounds(found, item.source);
        done();
      });
    });
  });

  test('using placeholder', function(done) {
    var searchFor = 'app.$$$()';
    anatomia.translator.read(__dirname + '/data/other/specific.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 2);
        // displayFounds(found, item.source);
        done();
      });
    });
  });

  test('using multiple placeholders', function(done) {
    var searchFor = 'while($$$) {\
      _results.push(nr.remove());\
    }';
    anatomia.translator.read(__dirname + '/data/other/chosen.proto.js', function(err, trees) {
      var item = trees.pop();
      anatomia.finder.query(searchFor, item.tree, function(err, found) {
        assert.equal(err, null);
        assert.equal(found.length, 1);
        done();
      });
    });
  });

});
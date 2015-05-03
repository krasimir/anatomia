var glob = require('glob');
var esprima = require('esprima');
var escodegen = require('escodegen');
var path = require('path');
var fs = require('fs');

module.exports = function() {
  var api = {};

  api.stringToTree = function(str, loc) {
    var tree;
    try {
      tree = esprima.parse(str, {
        loc: typeof loc !== 'undefined' ? loc : true,
        range: false,
        raw: true
      });
    } catch(e) {
      console.log('Problem converting: ' + str);
      throw new Error(e);
    }
    return tree;
  };
  api.treeToString = function(tree, ops) {
    var options = ops || {
      format: {
        indent: {
          style: '  ',
          base: 0,
          adjustMultilineComment: false
        },
        newline: '\n',
        space: ' ',
        json: false,
        renumber: false,
        hexadecimal: false,
        quotes: 'single',
        escapeless: false,
        compact: false,
        parentheses: true,
        semicolons: true,
        safeConcatenation: false
      },
      moz: {
        starlessGenerator: false,
        parenthesizedComprehensionBlock: false,
        comprehensionExpressionStartsWithAssignment: false
      },
      parse: null,
      comment: false,
      sourceMap: undefined,
      sourceMapRoot: null,
      sourceMapWithCode: false,
      file: undefined,
      directive: false,
      verbatim: undefined
    };
    return escodegen.generate(tree, options);
  };
  api.locToString = function(loc, source) {
    if(typeof source === 'object') { source = api.treeToString(source); }
    var result = '';
    var lines = source.split('\n');
    if(loc.start.line !== loc.end.line) {
      var reading = false;
      lines.forEach(function(l, i) {
        if(loc.start.line-1 === i) {
          reading = true;
          result += l.substr(loc.start.column, l.length) + '\n';
        } else if(loc.end.line-1 === i) {
          result += l.substr(0, loc.end.column);
          reading = false;
        } else if(reading) {
          result += l + '\n';
        }
      });
    } else {
      result = lines[loc.start.line-1].substr(loc.start.column, loc.end.column);
    }
    return result;
  };
  api.read = function(paths, callback, noDebug) {
    if(!Array.isArray(paths)) { paths = [paths]; }
    var trees = [];
    var totalFiles = 0;
    var done = function() {
      if(trees.length === totalFiles) {
        callback(null, trees);
      }
    };
    paths.forEach(function(p) {
      glob(p, {}, function(err, files) {
        if(err) { return callback(err); }
        if(files.length === 0 && !noDebug) { console.log('There are no files matching ' + p); }
        totalFiles += files.length;
        files.forEach(function(f) {
          fs.readFile(f, function(err, source) {
            if(err) { return callback(err); }
            source = source.toString('utf8');
            trees.push({
              file: path.basename(f),
              path: f,
              source: source,
              tree: api.stringToTree(source)
            });
            done();
          });          
        });
      });  
    });
  };

  return api;
  
};
var glob = require('glob');
var esprima = require('esprima');
var escodegen = require('escodegen');
var path = require('path');
var fs = require('fs');

module.exports = function() {
  var api = {};

  api.stringToTree = function(str, loc) {
    try {
      var tree = esprima.parse(str, {
        loc: typeof loc !== 'undefined' ? loc : true
      });
    } catch(e) {
      console.log(e);
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
  api.read = function(paths, callback) {
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
        totalFiles += files.length;
        files.forEach(function(f) {
          fs.readFile(f, function(err, source) {
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
  api.locToString = function(loc, source) {
    if(typeof source === 'object') { source = api.treeToString(source); }
    var result = '';
    var lines = source.split('\n');
    var startLine = lines[loc.start.line-1];
    if(loc.start.line !== loc.end.line) {
      // TODO: handle multiline text
    } else {
      result = startLine.substr(loc.start.column, loc.end.column);
    }
    return result;
  };

  return api;
  
};
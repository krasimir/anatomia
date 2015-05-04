var _ = require('lodash');
var estraverse = require('estraverse');
var syntax = require('../helpers/syntax')();
var placeholderKeyword = '$$$';

var getTargets = function(node) {
  return syntax.VisitorKeys[node.type];
};
var matchNodes = function(n1, n2, options) {
  var matches;
  if(Array.isArray(n1)) {
    matches = 0;
    var isN2Array = Array.isArray(n2);
    n1.forEach(function(n, i) {
      var nn1 = n;
      var nn2 = isN2Array ? n2[i] : n2;
      if(nn1 && nn2 && nn1.type === nn2.type && matchNodes(nn1, nn2, options)) {
        matches += 1;
      }
    });
    return matches === n1.length;
  }
  if(n1 === null) {
    return true;
  } else if(n1.type === 'Identifier' && n1.name === placeholderKeyword) {
    return true;
  } else if(n1.type && n2.type && n1.type === n2.type) {
    // console.log('--------------------\n', n1, "\n", n2, "\n");
    display = true;
    var targets = getTargets(n1);
    matches = 0;
    if(targets.length === 0) {
      if(options.exact) {
        return n1.name === placeholderKeyword || n1.name === n2.name || (n1.type && n1.value && n1.type === n2.type && n1.value === n2.value);
      } else {
        return true;
      }
    } else {
      targets.forEach(function(t) {
        if(matchNodes(n1[t], n2[t], options)) {
            matches += 1;
          }
      });
      return matches === targets.length;
    }
  } else {
    return false;
  }
};

module.exports = function(anatomia) {
  var api = {};
  api.query = function(str, tree, options, callback) {
    if(typeof options === 'function') {
      callback = options;
      options = {
        exact: true
      };
    }
    var queryNode = anatomia.translator.stringToTree(str, null).body[0];
    // console.log(JSON.stringify(queryNode, null, 2));
    var targets = getTargets(queryNode);
    var found = [];
    estraverse.traverse(tree, {
      enter: function(node, parent) {
        var matches = 0;
        targets.forEach(function(t) {
          if(matchNodes(queryNode[t], node, options)) {
            matches += 1;
          }
        });
        if(matches === targets.length) {
          found.push(node);
        }
      },
      leave: function(node, parent) {}
    });
    if(found.length === 0) {
      callback({ error: 'Nothing found.'});
    } else {
      callback(null, found);
    }
  };
  return api;
};
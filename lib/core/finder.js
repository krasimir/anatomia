var _ = require('lodash');
var estraverse = require('estraverse');
var syntax = require('../helpers/syntax')();

var getTargets = function(node) {
  return syntax.VisitorKeys[node.type];
};
var matchNodes = function(n1, n2) {
  var matches;
  if(Array.isArray(n1)) {
    matches = 0;
    n1.forEach(function(n) {
      if(matchNodes(n, n2)) {
        matches += 1;
      }
    });
    return matches === n1.length;
  }
  if(n1 === null) {
    return true;
  } else if(n1.type && n2.type && n1.type === n2.type) {
    display = true;
    var targets = getTargets(n1);
    matches = 0;
    if(targets.length === 0) {
      return n1.name === n2.name;
    } else {
      targets.forEach(function(t) {
        if(matchNodes(n1[t], n2[t])) {
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
  api.query = function(str, tree, callback) {
    var queryNode = anatomia.translator.stringToTree(str, null).body[0];
    var targets = getTargets(queryNode);
    var found = [];
    estraverse.traverse(tree, {
      enter: function(node, parent) {
        var matches = 0;
        targets.forEach(function(t) {
          if(matchNodes(queryNode[t], node)) {
            matches += 1;
          }
        });
        if(matches === targets.length) {
          found.push(node);
        }
      },
      leave: function(node, parent) {

      }
    });
    if(found.length === 0) {
      callback({ error: 'Nothing found.'});
    } else {
      callback(null, found);
    }
  };
  return api;
};
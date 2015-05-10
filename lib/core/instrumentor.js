var falafel = require('falafel');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(anatomia) {

  var api = {};

  api.process = function(source, cb) {
    var patch = function(node, what, data) {
      var l = node.loc.start.line + ',' + node.loc.start.column + ',';
      l += node.loc.end.line + ',' + node.loc.end.column;
      return "_A('" + what + "', '" + data + "', '" + l + "');";
    };
    var output = falafel(source, { locations: true, raw: true }, function (node) {
      
      if(node.type === 'VariableDeclaration') {
        var vars = _.map(node.declarations, function(d) {
          return d && d.id ? d.id.name : '';
        }).join(', ');
        node.update(patch(node, 'V', vars) + node.source());
      }
      
    });
    cb(null, output);
  };

  api.processFile = function(file, cb) {
    fs.readFile(file, function(err, data) {
      if(err) { return cb(err); }
      api.process(data.toString('utf8'), cb);
    });
  };

  api.dictionary = function() {
    var dict = {
      'V': 'Variable definition'
    };
  };

  return api;

};
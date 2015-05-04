var falafel = require('falafel');
module.exports = function(anatomia) {

  var api = {};

  api.process = function(source) {
    var output = falafel(source, function (node) {
      console.log('--------------');
      console.log(node);
    });
    console.log(output);
  };

  return api;

};
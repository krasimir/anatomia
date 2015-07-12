require('./helpers/polyfills');

var acorn = require("acorn");

module.exports = function () {
  var api = {};
  
  api.parse = function (code) {
    var ast = acorn.parse(code);
    console.log(ast);
  };

  return api;
};
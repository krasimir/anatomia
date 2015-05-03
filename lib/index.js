module.exports = function() {
  var api = {};
  api.translator = require('./core/translator')(api);
  api.finder = require('./core/finder')(api);
  api.keywords = require('./helpers/keywords');
  api.version = function() {
    return (require('../package.json')).version;
  };
  return api;
};
require('./helpers/polyfills');

module.exports = function () {
  var api = {};
  var middlewares = [];

  api.stringToTokens = function (str) {
    var jsTokens = require("js-tokens");
    var result = [];
    while(match = jsTokens.exec(str)) {
      var token = jsTokens.matchToToken(match);
      result.push(token);
    }
    return result;
  };
  api.tokensToString = function (tokens) {
    return tokens.map(function (token) {
      return token.value;
    }).join('');
  };
  api.use = function (middleware) {
    middlewares.push(middleware);
    return api;
  };
  api.process = function (str) {
    var tokens = api.stringToTokens(str);
    console.log(tokens);
    middlewares.forEach(function (middleware) {
      var matchHandler = middleware.match.bind(middleware);

    });
    return api.tokensToString(tokens);
  };

  return api;
};
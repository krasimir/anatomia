module.exports = function(anatomia) {

  var api = {};

  api.process = function(tree) {
    if(typeof tree === 'string') {
      tree = anatomia.translator.stringToTree(tree);
    }
    
  };

  return api;

};
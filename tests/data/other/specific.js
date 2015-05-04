var MyAwesomeFramework = function() {
  var result = this.doSomething(function(param) {
    if(param) return param > 1 ? param + 1 : param;
    else return 42;
  });
  console.log(result);
};

MyAwesomeFramework.prototype = {
  doSomething: function(f) {
    var foo, bar, zar = 2;
    return f(foo) + f(bar) + f(zar);
  }
};
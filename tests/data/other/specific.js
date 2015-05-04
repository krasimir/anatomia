var MyAwesomeFramework = function() {
  var result = this.doSomething(function(param) {
    if(param) return param > 1 ? param + 1 : param;
    else return 42;
  });
  var anotherThing = function(sum) {
    var t = 2;
    return sum * t;
  };
  console.log(anotherThing(result));
};

MyAwesomeFramework.prototype = {
  doSomething: function(f) {
    var foo, bar, zar = 2;
    return f(foo) + f(bar) + f(zar) + f('nothing here');
  }
};

var app = new MyAwesomeFramework();
app.doSomething().fire('this method doesn\'t exists');
app.andOneMore();
var esprima = require('esprima');
var tmpl = require('lodash.template');
var FunctionExpression = function(node, self) {
  var name = (node.id && node.id.name) || self.name || "anonymous function";
  node.name = name;

  self.funcName = name;
  self.loc = node.loc;
  var body = node.body.body;
  if (self.startFunc) {
    var startSentence = tmpl(self.startFunc, {name: name, loc: node.loc});
    var startAst = esprima.parse(startSentence);
    startAst.body.forEach(function(a){
      body.unshift(a);
    });
  }

  if (self.endFunc) {
    var endSentence = tmpl(self.endFunc, {name: name, loc: node.loc});
    var endAst = esprima.parse(endSentence);
    endAst.body.forEach(function(a){
      body.push(a);
    });
  }
  node.body.body = body;
  return node;
};

module.exports = FunctionExpression;

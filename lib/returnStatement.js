var esprima = require('esprima');
var escodegen = require('escodegen');
var tmpl = require('lodash.template');
var ReturnStatement = function(node, self) {
  var name = self.funcName || "anonymous function";
  var loc = self.loc || "undefined";
  if (self.returnStmt) {
    var arg = "undefined";
    if (node.argument) {
      arg = escodegen.generate(node.argument);
    }
    var returnSentence = tmpl(self.returnStmt, {name: name, arg: arg, loc: loc});
    var returnAst = esprima.parse(returnSentence);
    node.argument = returnAst.body[0].expression;
  }
  return node;
};

module.exports = ReturnStatement;

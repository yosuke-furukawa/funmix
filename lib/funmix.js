var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var tmpl = require('lodash.template');

var Funmix = function(src) { 
  this.ast = esprima.parse(src);
};

Funmix.prototype.setStartProgram = function(startProgram) {
  this.startProgram = startProgram;
};

Funmix.prototype.setEndProgram = function(endProgram) {
  this.endProgram = endProgram;
};

Funmix.prototype.setStartFunc = function(startFunc) {
  this.startFunc = startFunc;
};

Funmix.prototype.setEndFunc = function(endFunc) {
  this.endFunc = endFunc;
};

Funmix.prototype.generate = function() {
  return escodegen.generate(this.replace());
};

Funmix.prototype.replace = function(){
  return estraverse.replace(this.ast, {
    enter: function (node, parent) {
      if (node.type === 'Program') {
        if (this.startProgram) {
          var startPrgAst = esprima.parse(this.startProgram);
          startPrgAst.body.forEach(function(a) {
            node.body.unshift(a);
          });
        }
        if (this.endProgram) {
          var endPrgAst = esprima.parse(this.endProgram);
          endPrgAst.body.forEach(function(a) {
            node.body.push(a);
          });
        }
      } else if (node.type === 'Identifier') { 
        this.name = node.name;
      } else if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
        var name = (node.id && node.id.name) || this.name || "no name function";
        var body = node.body.body;
        if (this.startFunc) {
          var startSentence = tmpl(this.startFunc, {name: name});
          var startAst = esprima.parse(startSentence);
          startAst.body.forEach(function(a){
            body.unshift(a);
          });
        }

        if (this.endFunc) {
          var endSentence = tmpl(this.endFunc, {name: name});
          var endAst = esprima.parse(endSentence);
          endAst.body.forEach(function(a){
            body.push(a);
          });
        }
        node.body.body = body;
        return node;
      } else {
        this.name = null;
      }
    }.bind(this),
  });
};

module.exports = Funmix;

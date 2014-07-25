var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var tmpl = require('lodash.template');
var FunctionExpression = require('./functionExpression');
var ReturnStatement = require('./returnStatement');

var Funmix = function(src) { 
  var option = {tolerant: true, tokens: true, raw: true, loc: true};
  this.ast = esprima.parse(src, option);
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

Funmix.prototype.setReturnStmt = function(returnStmt) {
  this.returnStmt = returnStmt;
};

Funmix.prototype.generate = function() {
  return escodegen.generate(this.replace());
};

Funmix.prototype.replace = function(){
  // replace AST
  var replacedAst = estraverse.replace(this.ast, {
    enter: function (node, parent) {
      if (node.type === 'Program') {
      } else if (node.type === 'Identifier') { 
        this.name = node.name;
      } else if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
        return FunctionExpression(node, this);
      } else if (node.type === 'ReturnStatement') {
        return ReturnStatement(node, this);
      } else {
        this.name = null;
      }
    }.bind(this),
    leave: function(node, parent){
      if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
        this.funcName = null;
      }
    },
  });
  
  // prepend codes the begining of source
  if (this.startProgram) {
    var startPrgAst = esprima.parse(this.startProgram);
    startPrgAst.body.forEach(function(a) {
      replacedAst.body.unshift(a);
    });
  }

  // append codes the eng of source
  if (this.endProgram) {
    var endPrgAst = esprima.parse(this.endProgram);
    endPrgAst.body.forEach(function(a) {
      replacedAst.body.push(a);
    });
  }
  return replacedAst;
};

module.exports = Funmix;

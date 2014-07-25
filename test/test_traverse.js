var Funmix = require("..");
var esprima = require("esprima");
var escodegen = require('escodegen');

var assert = require("power-assert");
describe('Funmix', function(){
  describe('#replace()', function(){
    it('insert function', function(){
      var src = " function abc() { var test = function(){console.log('hello');}; test();} abc();";
      var expected = " function abc() { console.time('abc'); var test = function(){console.time('test'); console.log('hello'); console.timeEnd('test');}; test(); console.timeEnd('abc');} abc();";

      expected = escodegen.generate(esprima.parse(expected));
      var enter = "console.time('${name}');";
      var leave = "console.timeEnd('${name}');";
      var funmix = new Funmix(src);
      funmix.setStartFunc(enter);
      funmix.setEndFunc(leave);
      var code = funmix.generate();
      assert(expected == code);
    });
  });
});

describe('Funmix', function(){
  describe('#replace()', function(){
    it('immediate function', function(){
      var src = "(function() { var test = function(){console.log('hello');}; test(); return 'abc';}());";
      var expected = "function timeEndFunc(name, args){console.timeEnd(name); return args;}\n\n\n(function() { console.time('anonymous function'); var test = function(){console.time('test'); console.log('hello');  console.timeEnd('test');}; test(); return timeEndFunc('test', 'abc');console.timeEnd('anonymous function');}());console.log('finish');";

      expected = escodegen.generate(esprima.parse(expected));
      var startPrg = "function timeEndFunc(name, args){console.timeEnd(name); return args;}";
      var endPrg = "console.log('finish');";
      var enter = "console.time('${name}');";
      var leave = "console.timeEnd('${name}');";
      var returnStmt = "timeEndFunc('${name}', ${arg});";
      var funmix = new Funmix(src);
      funmix.setStartProgram(startPrg);
      funmix.setStartFunc(enter);
      funmix.setEndFunc(leave);
      funmix.setEndProgram(endPrg);
      funmix.setReturnStmt(returnStmt);
      var code = funmix.generate();
      assert(expected, code);
    });
  });
});

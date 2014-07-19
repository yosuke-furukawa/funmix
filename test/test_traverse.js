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
      var src = "(function() { var test = function(){console.log('hello');}; test();}());";
      var expected = "console.log('begin');(function() { console.time('no name function'); var test = function(){console.time('test'); console.log('hello'); console.timeEnd('test');}; test(); console.timeEnd('no name function');}());console.log('finish');";

      expected = escodegen.generate(esprima.parse(expected));
      var startPrg = "console.log('begin');";
      var endPrg = "console.log('finish');";
      var enter = "console.time('${name}');";
      var leave = "console.timeEnd('${name}');";
      var funmix = new Funmix(src);
      funmix.setStartProgram(startPrg);
      funmix.setStartFunc(enter);
      funmix.setEndFunc(leave);
      funmix.setEndProgram(endPrg);
      var code = funmix.generate();
      assert(expected == code);
    });
  });
});

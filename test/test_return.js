var Funmix = require("..");
var esprima = require("esprima");
var escodegen = require('escodegen');
var assert = require("power-assert");
var fs = require('fs');
var path = require('path');

describe('Funmix', function(){
  describe('#replace()', function(){
    it('return', function(){
      var src = fs.readFileSync(path.join(__dirname, "..", "fixtures", "fibonacci.js"));
      var expected = fs.readFileSync(path.join(__dirname, "..", "fixtures", "expected_fibonacci.js"));
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
      assert(code === expected);
    });
  });
});


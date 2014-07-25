var Funmix = require("..");
var esprima = require("esprima");
var escodegen = require('escodegen');
var assert = require("power-assert");
var fs = require('fs');
var path = require('path');

describe('Funmix', function(){
  describe('#replace()', function(){
    it('return', function(){
      var src = fs.readFileSync(path.join(__dirname, "..", "fixtures", "loc.js"));
      var expected = fs.readFileSync(path.join(__dirname, "..", "fixtures", "expected_loc.js"));
      expected = escodegen.generate(esprima.parse(expected));
      var enter = "console.time('${name} line:${loc.start.line}');";
      var leave = "console.timeEnd('${name} line:${loc.start.line}');";
      var funmix = new Funmix(src);
      funmix.setStartFunc(enter);
      funmix.setEndFunc(leave);
      var code = funmix.generate();
      assert(code === expected);
    });
  });
});



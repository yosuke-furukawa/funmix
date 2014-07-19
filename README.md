FunMix [![Build Status](https://travis-ci.org/yosuke-furukawa/funmix.svg?branch=master)](https://travis-ci.org/yosuke-furukawa/funmix)
========================

FunMix can insert sentences the beginning and the end of each function.

Example
========================

```javascript
var Traverse = require("funmix");

var src = " function abc() { var test = function(){console.log('hello');}; test();} abc();";

/*
BEFORE
function abc() { 
    var test = function(){
       console.log('hello');
    };
    test();
}
abc();
*/ 

expected = escodegen.generate(esprima.parse(expected));
var startPrg = "console.log('begin');";
var endPrg = "console.log('finish');";
var enter = "console.time('${name}');";
var leave = "console.timeEnd('${name}');";
var traverse = new Traverse(src);
traverse.setStartProgram(startPrg);
traverse.setEndProgram(endPrg);
traverse.setStartFunc(enter);
traverse.setEndFunc(leave);
var code = traverse.generate();

/*
AFTER
console.log('begin');
function abc() { 
    console.time('abc'); 
    var test = function(){
       console.time('test');
       console.log('hello');
       console.timeEnd('test');
    };
    test();
    console.timeEnd('abc');
}
abc();
console.log('finish');
*/ 
```


Install
===========

```sh
$ npm install funmix -S
```


License
===========

MIT

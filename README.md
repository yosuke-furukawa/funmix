FunMix [![Build Status](https://travis-ci.org/yosuke-furukawa/funmix.svg?branch=master)](https://travis-ci.org/yosuke-furukawa/funmix)
========================

FunMix can insert sentences the beginning and the end of each function.

Example
========================

```javascript
var Funmix = require("funmix");

var src = " var result = 0; function fibonacci1(n) { if (n<=2) return n; return fibonacci1(n-1) + fibonacci1(n-2); } ";

/*
BEFORE
var result = 0;
function fibonacci1(n) {
  if (n<=2) return n;
  return fibonacci1(n-1) + fibonacci1(n-2);
}

result = fibonacci1(4);
console.log(result);
*/ 

var startPrg = "function timeEndFunc(name, args){console.timeEnd(name); return args;}";
var endPrg = "console.log('finish');";
var enter = "console.time('${name}');";
var leave = "console.timeEnd('${name}');";
var returnStmt = "timeEndFunc('${name}', ${arg});";
var funmix = new Funmix(src);
funmix.setStartProgram(startPrg);
funmix.setEndProgram(endPrg);
funmix.setStartFunc(enter);
funmix.setEndFunc(leave);
funmix.setReturnStmt(returnStmt);
var code = funmix.generate();

/*
AFTER
function timeEndFunc(name, args) {
    console.timeEnd(name);
    return args;
}
var result = 0;
function fibonacci1(n) {
    console.time('fibonacci1');
    if (n <= 2)
        return timeEndFunc('fibonacci1', n);
    return timeEndFunc('fibonacci1', fibonacci1(n - 1) + fibonacci1(n - 2));
    console.timeEnd('fibonacci1');
}
result = fibonacci1(4);
console.log(result);
console.log('finish');
*/ 
```


Install
===========

```sh
$ npm install funmix -S
```

Methods
===========

- `setStartProgram(program)` - set `program` code at the beginning of the given code

```javascript
/*
BEFORE
var result = 0;
function fibonacci1(n) {
  if (n<=2) return n;
  return fibonacci1(n-1) + fibonacci1(n-2);
}

result = fibonacci1(4);
console.log(result);
*/ 

var startPrg = "console.log('START!!!!');";
var funmix = new Funmix(src);
funmix.setStartProgram(startPrg);
var code = funmix.generate();

/*
AFTER
console.log('START!!!!');
var result = 0;
function fibonacci1(n) {
  if (n<=2) return n;
  return fibonacci1(n-1) + fibonacci1(n-2);
}

result = fibonacci1(4);
console.log(result);
*/ 

```


- `setEndProgram(program)` - set `program` code at the end of the given code

```javascript
/*
BEFORE
var result = 0;
function fibonacci1(n) {
  if (n<=2) return n;
  return fibonacci1(n-1) + fibonacci1(n-2);
}

result = fibonacci1(4);
console.log(result);
*/ 

var endPrg = "console.log('END!!!!');";
var funmix = new Funmix(src);
funmix.setStartProgram(startPrg);
var code = funmix.generate();

/*
AFTER
var result = 0;
function fibonacci1(n) {
  if (n<=2) return n;
  return fibonacci1(n-1) + fibonacci1(n-2);
}

result = fibonacci1(4);
console.log(result);
console.log('END!!!!');
*/ 

```


- `setStartFunc(program)` - set `program` code at the beginnig of each function
- `setEndFunc(program)` - set `program` code at the end of each function

```javascript
/*
BEFORE
function test(n) {
  console.log(n);
}
test("Hello");
*/ 

var startFunc = "console.time('${name} line:${loc.start.line}');";
var endFunc = "console.timeEnd('${name} line:${loc.start.line}');";
var funmix = new Funmix(src);
funmix.setStartFunc(startPrg);
funmix.setEndFunc(startPrg);
var code = funmix.generate();

/*
AFTER
function test(n) {
  console.time('test line:1');
  console.log(n);
  console.timeEnd('test line:1');
}
test("Hello");
*/ 

```

- `setReturnStmt(program)` - set `program` code at the return statement



License
===========

MIT

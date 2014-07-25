function test(n) {
  console.time('test line:1');
  console.log(n);
  console.timeEnd('test line:1');
}
test("Hello");


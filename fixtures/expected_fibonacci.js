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

var result = 0;
function fibonacci1(n) {
  if (n<=2) return n;
  return fibonacci1(n-1) + fibonacci1(n-2);
}

result = fibonacci1(4);
console.log(result);


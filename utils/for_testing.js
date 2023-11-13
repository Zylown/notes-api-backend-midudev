//palindromo es una palabra que se lee igual al derecho y al reves
//aca creamos las funciones para ser testeados
const palindrome = (string) => {
  if (typeof string === "undefined") return;
  return string.split("").reverse().join("");
};
//split convierte en un array la palabra
//reverse invierte el array
//join convierte el array en un string
// console.log(palindrome("zorra"));

const average = (array) => {
    if(array.length === 0) return 0;

  let sum = 0;
  array.forEach((num) => {
    sum = sum + num; // es igual a sum += num
  });
  return sum / array.length;
};

module.exports = {
  palindrome,
  average,
};

const { palindrome } = require("../utils/for_testing");

test("palindrome of sevas", () => {
  const result = palindrome("sevas");
  expect(result).toBe("saves"); //esperamos que este resultado sea saves
});

test("palindrome of empty string", () => {
  const result = palindrome("");
  expect(result).toBe("");
});

test("palindrome of undefined", () => {
  const result = palindrome();
  expect(result).toBeUndefined(); //esperamos que este resultado sea undefined
});

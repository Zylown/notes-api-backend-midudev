const { palindrome } = require("../utils/for_testing");

test.skip("palindrome of sevas", () => {
  const result = palindrome("sevas");
  expect(result).toBe("saves"); //esperamos que este resultado sea saves
});

test.skip("palindrome of empty string", () => {
  const result = palindrome("");
  expect(result).toBe("");
});

test.skip("palindrome of undefined", () => {
  const result = palindrome();
  expect(result).toBeUndefined(); //esperamos que este resultado sea undefined
});

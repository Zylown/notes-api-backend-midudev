const { average } = require("../utils/for_testing");

// test("average of one value is the value itself", () => {
//   const result = average([3, 10, 5]);
//   expect(result).toBe(6);
// });

describe("average", () => {
  test("of one value is the value itself", () => {
    expect(average([1])).toBe(1);
  });
});

describe("average", () => {
  test("of many is calculated correctly", () => {
    expect(average([3,10,5])).toBe(6);
  });
});

describe("average", () => {
  test("of empty array is zero", () => {
    expect(average([])).toBe(0);
    // expect(average([])).toBeNaN();
  });
});

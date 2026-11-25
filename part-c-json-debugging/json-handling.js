"use strict";

/* ===================== Task 1: stringify() and parse() ===================== */
console.log("--- Task 1: JSON.stringify() and JSON.parse() ---");

const order = {
  orderId: 501,
  customer: "Rahul",
  amount: 5000,
  deliveryDate: undefined,
  discount: null,
  calculateTax() {
    return 500;
  },
};

const jsonString = JSON.stringify(order);
console.log("Stringified:", jsonString);

const parsedOrder = JSON.parse(jsonString);
console.log("Parsed:", parsedOrder);
console.log("Lost properties:", Object.keys(order).filter((key) => !(key in parsedOrder)));

/*
 Lost: deliveryDate (undefined) and calculateTax (function).
 Kept: discount, because null IS a valid JSON value.

 Why? JSON is a text format for DATA only. It has no representation for
 undefined or functions, so stringify() skips them in objects. (In arrays
 they become null so positions are preserved.)
*/

/* ===================== Task 2: Predict the output ===================== */
console.log("\n--- Task 2: Predict the output ---");

// Helper: print the result, or the error if one is thrown
const run = (label, fn) => {
  try {
    console.log(`${label} ->`, fn());
  } catch (error) {
    console.log(`${label} -> ${error.name}: ${error.message}`);
  }
};

// Q1: undefined property is skipped -> {"name":"Rahul"}
run("Q1", () => JSON.stringify({ name: "Rahul", age: undefined }));

// Q2: undefined in array becomes null -> [10,null,30]
run("Q2", () => JSON.stringify([10, undefined, 30]));

// Q3: NaN and Infinity are not valid JSON numbers -> {"price":null,"discount":null}
run("Q3", () => JSON.stringify({ price: NaN, discount: Infinity }));

// Q4: keys must be in double quotes, strings too -> SyntaxError
run("Q4", () => JSON.parse("{name: 'Rahul', age: 25}"));

// Q5: object refers to itself -> TypeError (circular structure)
run("Q5", () => {
  const user = { name: "Rahul" };
  user.self = user;
  return JSON.stringify(user);
});

// Q6: Date has toJSON() -> ISO string {"createdAt":"2026-01-01T00:00:00.000Z"}
run("Q6", () => JSON.stringify({ createdAt: new Date("2026-01-01") }));

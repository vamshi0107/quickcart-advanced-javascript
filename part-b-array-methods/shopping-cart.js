"use strict";

// Cart data from the assignment
const cart = [
  { id: 101, name: "Laptop", price: 50000, qty: 1, category: "Electronics" },
  { id: 102, name: "Mouse", price: 800, qty: 2, category: "Accessories" },
  { id: 103, name: "Keyboard", price: 1500, qty: 1, category: "Accessories" },
  { id: 104, name: "Monitor", price: 12000, qty: 1, category: "Electronics" },
  { id: 105, name: "Headphones", price: 2500, qty: 2, category: "Accessories" },
];

/* ===================== Task 1: Array methods ===================== */
console.log("--- Task 1: Array methods ---");

// map(): new array of names with total item price
const itemTotals = cart.map(({ name, price, qty }) => ({ name, total: price * qty }));
console.log("map:", itemTotals);

// filter(): products above ₹2,000
const expensive = cart.filter((item) => item.price > 2000);
console.log("filter (>2000):", expensive.map((i) => i.name));

// reduce(): total cart value
const cartTotal = cart.reduce((sum, { price, qty }) => sum + price * qty, 0);
console.log("reduce (cart total):", cartTotal);

// forEach(): log name, category and quantity (returns nothing)
cart.forEach(({ name, category, qty }) =>
  console.log(`forEach: ${name} | ${category} | Qty: ${qty}`)
);

// Combined: total value of all Electronics products
const electronicsTotal = cart
  .filter((item) => item.category === "Electronics")
  .reduce((sum, { price, qty }) => sum + price * qty, 0);
console.log("Electronics total:", electronicsTotal);

/*
 Q1. map() vs forEach()?
 A: map() returns a NEW array of transformed values; forEach() just runs a
    function for each item and returns undefined.
 Q2. Does filter() change the original array?
 A: No. It returns a new array; the original stays unchanged.
 Q3. Why is reduce() useful for totals?
 A: It folds an array into a single value (sum, count, object) using an
    accumulator.
 Q4. Which method returns a new transformed array?
 A: map().
*/

/* ===================== Task 2: Map and Set ===================== */
console.log("\n--- Task 2A: Map inventory ---");

// key = product ID, value = product details
const inventory = new Map(cart.map((item) => [item.id, { ...item }]));

console.log("Get 101:", inventory.get(101));

inventory.get(102).qty = 10; // update quantity
console.log("Updated Mouse qty:", inventory.get(102).qty);

inventory.delete(103); // delete Keyboard
console.log("Has 103 after delete?", inventory.has(103));

for (const [id, product] of inventory) {
  console.log(`Loop: ${id} -> ${product.name} (Qty: ${product.qty})`);
}

console.log("\n--- Task 2B: Set removes duplicates ---");
const emails = [
  "rahul@gmail.com",
  "priya@gmail.com",
  "rahul@gmail.com",
  "arjun@gmail.com",
  "priya@gmail.com",
];
const uniqueEmails = [...new Set(emails)];
console.log(uniqueEmails);

/*
 Q1. Map vs plain object?
 A: Map keys can be ANY type (objects, functions); object keys are strings/
    symbols. Map keeps insertion order, has .size, and is built for frequent
    add/remove.
 Q2. Why is Set good for removing duplicates?
 A: A Set only stores unique values, so duplicates are ignored automatically.
 Q3. Can a Map use an object as a key?
 A: Yes (matched by reference).
 Q4. Does Set keep insertion order?
 A: Yes, it iterates in the order values were first added.
*/

/* ===================== Task 3: freeze() vs seal() ===================== */
console.log("\n--- Task 3: Object.freeze() vs Object.seal() ---");

const productConfig = { name: "Laptop", price: 50000, stock: 20 };
const frozen = Object.freeze({ ...productConfig });
const sealed = Object.seal({ ...productConfig });

// "use strict" makes illegal changes throw, so we catch and log them
const attempt = (label, action) => {
  try {
    action();
    console.log(`${label}: allowed`);
  } catch (error) {
    console.log(`${label}: blocked (${error.name})`);
  }
};

console.log("Frozen object:");
attempt("  change price", () => { frozen.price = 45000; });
attempt("  add property", () => { frozen.brand = "Dell"; });
attempt("  delete property", () => { delete frozen.stock; });
console.log("  result:", frozen);

console.log("Sealed object:");
attempt("  change price", () => { sealed.price = 45000; });
attempt("  add property", () => { sealed.brand = "Dell"; });
attempt("  delete property", () => { delete sealed.stock; });
console.log("  result:", sealed);

// Shallow freeze demo: nested objects are NOT frozen
const nested = Object.freeze({ name: "Laptop", specs: { ram: "8GB" } });
nested.specs.ram = "16GB"; // allowed!
console.log("Nested after change:", nested.specs.ram); // 16GB

/*
 Q1. freeze() vs seal()?
 A: freeze(): no add, delete or change. seal(): no add or delete, but
    existing values CAN be changed.
 Q2. Can a property be changed after seal()?
 A: Yes (as long as it is writable).
 Q3. Are nested objects frozen automatically?
 A: No.
 Q4. What is shallow freezing?
 A: freeze() only locks the top level; nested objects stay mutable unless you
    freeze them too (deep freeze, e.g. recursively).
*/

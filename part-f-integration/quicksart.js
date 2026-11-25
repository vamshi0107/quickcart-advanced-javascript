"use strict";

// Product class (Part A)
class Product {
  constructor(id, name, price, qty) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const products = [
  new Product(1, "Laptop", 50000, 1),
  new Product(2, "Mouse", 1000, 2),
  new Product(3, "Monitor", 15000, 1),
  new Product(4, "Keyboard", 2000, 1),
];

// Frozen order configuration (Part B)
const orderConfig = Object.freeze({ customer: "Rahul", currency: "₹" });
const { customer, currency } = orderConfig; // destructuring

// map(): product totals
const productTotals = products.map(({ name, price, qty }) => ({
  name,
  total: price * qty,
}));

// filter(): products over ₹5,000
const highValueProducts = products.filter(({ price }) => price > 5000);

// reduce(): order total
const orderTotal = productTotals.reduce((sum, { total }) => sum + total, 0);

// Set: unique product IDs
const uniqueIds = new Set(products.map(({ id }) => id));

// Map: inventory (id -> product)
const inventory = new Map(products.map((product) => [product.id, product]));

// Order object, converted with JSON.stringify()
const order = {
  customer,
  items: productTotals,
  highValueItems: highValueProducts.map(({ name }) => name),
  total: orderTotal,
};
const orderJson = JSON.stringify(order);

// async/await confirmation with try/catch
const confirmOrder = async () => {
  try {
    console.log("Order Status: Processing...");
    await sleep(1000); // simulate payment + stock check
    if (inventory.size === 0) throw new Error("No products in inventory");
    console.log("Order Status: Confirmed Successfully!");
  } catch (error) {
    console.log(`Order Status: Failed (${error.message})`);
  }
};

const printSummary = async () => {
  console.log("====== QUICKCART ORDER SUMMARY ======");
  console.log(`Customer: ${customer}`);
  console.log("Products:");
  productTotals.forEach(({ name, total }) =>
    console.log(`${name} - ${currency}${total}`)
  );
  console.log(`Total Order Amount: ${currency}${orderTotal}`);
  console.log(`Unique Products: ${uniqueIds.size}`);
  await confirmOrder();
  console.log("=====================================");
  console.log("Order JSON:", orderJson);
};

printSummary();

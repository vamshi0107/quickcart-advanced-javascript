"use strict";

/* ===================== Task 1: Prototype-based products ===================== */
(function task1() {
  console.log("--- Task 1: Prototype-based products ---");

  // Constructor function
  function Product(productName, price, category) {
    this.productName = productName;
    this.price = price;
    this.category = category;
  }

  // Shared method: stored once on the prototype, not copied per object
  Product.prototype.displayProduct = function () {
    return `${this.productName} | ₹${this.price} | ${this.category}`;
  };

  const p1 = new Product("Laptop", 50000, "Electronics");
  const p2 = new Product("T-Shirt", 799, "Clothing");
  const p3 = new Product("Mouse", 800, "Accessories");

  [p1, p2, p3].forEach((p) => console.log(p.displayProduct()));

  /*
   Q1. Why add displayProduct() to the prototype?
   A: If it is inside the constructor, every object gets its own copy of the
      function (wastes memory). On the prototype, all objects share one copy.

   Q2. __proto__ vs prototype?
   A: `prototype` is a property of a constructor FUNCTION; it holds the shared
      methods. `__proto__` is a property of every OBJECT that points to the
      prototype it inherited from. p1.__proto__ === Product.prototype  -> true

   Q3. What if JS cannot find a property on an object?
   A: It walks up the prototype chain (object -> Product.prototype ->
      Object.prototype -> null). If still not found, it returns undefined
      (or throws a TypeError if you try to call it as a function).
  */
  console.log(p1.__proto__ === Product.prototype); // true
  console.log(p1.unknownProp); // undefined
})();

/* ===================== Task 2: ES6 classes ===================== */
(function task2() {
  console.log("\n--- Task 2: ES6 classes ---");

  class Product {
    constructor(productName, price, category) {
      this.productName = productName;
      this.price = price;
      this.category = category;
    }

    getProductDetails() {
      return `${this.productName} (${this.category}) - ₹${this.price}`;
    }
  }

  class ElectronicProduct extends Product {
    constructor(productName, price, warrantyYears) {
      super(productName, price, "Electronics"); // must come before `this`
      this.warrantyYears = warrantyYears;
    }

    // Unique method
    getWarrantyInfo() {
      return `${this.productName} has ${this.warrantyYears} year(s) warranty`;
    }
  }

  class ClothingProduct extends Product {
    constructor(productName, price, size) {
      super(productName, price, "Clothing");
      this.size = size;
    }

    // Unique method
    getSizeInfo() {
      return `${this.productName} is available in size ${this.size}`;
    }
  }

  const laptop = new ElectronicProduct("Laptop", 50000, 2);
  const shirt = new ClothingProduct("T-Shirt", 799, "M");

  console.log(laptop.getProductDetails());
  console.log(laptop.getWarrantyInfo());
  console.log(shirt.getProductDetails());
  console.log(shirt.getSizeInfo());

  /*
   Q1. Purpose of extends?
   A: It makes a child class inherit properties and methods from a parent
      class, so code is reused (ElectronicProduct reuses getProductDetails).

   Q2. Why must super() be called before using this?
   A: In a child class, the parent constructor creates the object. `this`
      does not exist until super() runs, so using it earlier throws a
      ReferenceError.

   Q3. Are ES6 classes completely different from prototype inheritance?
   A: No. Classes are "syntactic sugar" over prototypes. Under the hood,
      methods still live on Class.prototype and inheritance still uses the
      prototype chain. Classes just give cleaner syntax.
  */
  console.log(typeof Product); // "function" -> classes are functions
})();

/* ===================== Task 3: ES6 syntax in checkout ===================== */
(function task3() {
  console.log("\n--- Task 3: ES6 syntax in checkout ---");

  // (A) Arrow function: final price after discount (percentage)
  const finalPrice = (price, discountPercent) =>
    price - (price * discountPercent) / 100;
  console.log("Final price:", finalPrice(50000, 10)); // 45000

  // (B) Template literal
  const customerName = "Rahul";
  const productName = "Laptop";
  const total = 50000;
  console.log(
    `Hello ${customerName}, your order of ${productName} is confirmed. Total: ₹${total}`
  );

  // (C) Destructuring
  const customer = { name: "Rahul", email: "rahul@gmail.com", city: "Mumbai" };
  const { name, email } = customer;
  console.log(name, email);

  // (D) Rest operator: collects any number of arguments into an array
  const calculateTotal = (...prices) =>
    prices.reduce((sum, price) => sum + price, 0);
  console.log("Total:", calculateTotal(50000, 800, 1500)); // 52300

  // (E) Spread: copy product with a new price, original unchanged
  const product = { name: "Laptop", price: 50000, category: "Electronics" };
  const updatedProduct = { ...product, price: 45000 };
  console.log(product); // price still 50000
  console.log(updatedProduct); // price 45000
})();

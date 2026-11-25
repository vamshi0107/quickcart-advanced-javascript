"use strict";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ===================== Task 1: Event loop ===================== */
const eventLoopDemo = async () => {
  console.log("--- Task 1: Event loop ---");
  console.log("Order Started");
  setTimeout(() => console.log("Payment Processing"), 0); // macrotask
  Promise.resolve().then(() => console.log("Payment Successful")); // microtask
  console.log("Order Completed");
  await sleep(50); // let the queues finish before the next task
};
/*
 Output order:
   Order Started
   Order Completed
   Payment Successful
   Payment Processing

 Q1. Why does the Promise callback run before setTimeout()?
 A: After the current script finishes, the event loop empties the microtask
    queue (promises) BEFORE taking the next macrotask (timers), even with 0 ms.
 Q2. Microtask vs macrotask queue?
 A: Microtasks: promise .then/.catch, queueMicrotask. Macrotasks: setTimeout,
    setInterval, DOM events, I/O. Microtasks have higher priority.
 Q3. Role of the call stack?
 A: It runs synchronous code, one function at a time (LIFO). Async callbacks
    wait until the stack is empty.
 Q4. What does the event loop do?
 A: It keeps checking: if the call stack is empty, move the next task from
    the microtask queue (first) or macrotask queue onto the stack.
*/

/* ===================== Task 2: Callbacks ===================== */
const validateOrder = (cb) =>
  setTimeout(() => {
    console.log("Order Validated");
    cb();
  }, 1000);

const processPayment = (cb) =>
  setTimeout(() => {
    console.log("Payment Completed");
    cb();
  }, 1000);

const sendConfirmation = (cb) =>
  setTimeout(() => {
    console.log("Confirmation Sent");
    cb();
  }, 1000);

const runWithCallbacks = (done) => {
  console.log("\n--- Task 2: Callbacks ---");
  validateOrder(() => {
    processPayment(() => {
      sendConfirmation(() => {
        console.log("All steps done (callbacks)");
        done();
      });
    });
  });
};
/*
 Why is callback hell hard to maintain?
 Each step nests inside the previous one, forming a "pyramid". The code is
 hard to read, error handling must be repeated at every level, and adding or
 reordering steps is risky.
*/

/* ===================== Task 3: Promises ===================== */
const validateOrderPromise = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("Order Validated");
      resolve();
    }, 1000)
  );

// shouldFail lets us demonstrate error handling
const processPaymentPromise = (shouldFail = false) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Payment Failed"));
        return;
      }
      console.log("Payment Completed");
      resolve();
    }, 1000)
  );

const sendConfirmationPromise = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("Confirmation Sent");
      resolve();
    }, 1000)
  );

const runWithPromises = () => {
  console.log("\n--- Task 3: Promises ---");
  return validateOrderPromise()
    .then(() => processPaymentPromise())
    .then(() => sendConfirmationPromise())
    .then(() => console.log("All steps done (promises)"))
    .catch((error) => console.log("Error:", error.message));
};

/* ===================== Task 4: async/await ===================== */
const placeOrder = async (simulatePaymentFailure = false) => {
  try {
    await validateOrderPromise();
    await processPaymentPromise(simulatePaymentFailure);
    await sendConfirmationPromise();
    console.log("Success: Order placed successfully!");
  } catch (error) {
    console.log(`Failure: Order could not be placed (${error.message})`);
  }
};

/* ===================== Task 5: Promise combinators ===================== */
const productsAPI = () =>
  new Promise((resolve) => setTimeout(() => resolve("Products Loaded"), 1000));
const paymentAPI = () =>
  new Promise((_, reject) => setTimeout(() => reject("Payment Service Failed"), 1500));
const deliveryAPI = () =>
  new Promise((resolve) => setTimeout(() => resolve("Delivery Loaded"), 2000));

const runCombinators = async () => {
  console.log("\n--- Task 5: Promise combinators ---");

  try {
    const results = await Promise.all([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("all():", results);
  } catch (error) {
    console.log("all() failed ->", error); // rejects as soon as one rejects
  }

  const settled = await Promise.allSettled([productsAPI(), paymentAPI(), deliveryAPI()]);
  console.log("allSettled():");
  settled.forEach((r, i) =>
    console.log(`  API ${i + 1}: ${r.status} ->`, r.value ?? r.reason)
  );

  try {
    console.log("race():", await Promise.race([productsAPI(), paymentAPI(), deliveryAPI()]));
  } catch (error) {
    console.log("race() rejected ->", error);
  }

  try {
    console.log("any():", await Promise.any([productsAPI(), paymentAPI(), deliveryAPI()]));
  } catch (error) {
    console.log("any() failed ->", error.errors);
  }
};
/*
 Q1. all() vs allSettled()?
 A: all() rejects immediately if ANY promise rejects. allSettled() always
    waits for all and reports each one's status (fulfilled/rejected).
 Q2. Does race() wait for success?
 A: No. It settles with the first promise to settle, success OR failure.
 Q3. any() vs race()?
 A: any() ignores rejections and returns the first SUCCESS; race() returns
    the first settled result of any kind.
 Q4. What if every promise in any() rejects?
 A: It rejects with an AggregateError (its .errors holds all reasons).
*/

/* ===================== Run everything in order ===================== */
const main = async () => {
  await eventLoopDemo();
  await new Promise((resolve) => runWithCallbacks(resolve));
  await runWithPromises();

  console.log("\n--- Task 4: async/await (success) ---");
  await placeOrder(false);
  console.log("\n--- Task 4: async/await (failure) ---");
  await placeOrder(true);

  await runCombinators();
};

main();

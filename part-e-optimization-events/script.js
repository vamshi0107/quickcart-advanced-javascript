"use strict";

// Helper: append a line to a <ul> log
const addLog = (listId, text) => {
  const li = document.createElement("li");
  li.textContent = text;
  document.getElementById(listId).appendChild(li);
};

/* ===================== Task 1: Debounce ===================== */
// Runs callback only after the user stops calling it for `delay` ms
const debounce = (callback, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId); // cancel the previous pending call
    timerId = setTimeout(() => callback(...args), delay);
  };
};

const searchInput = document.getElementById("searchInput");
const keyCount = document.getElementById("keyCount");
const searchCount = document.getElementById("searchCount");
const searchResult = document.getElementById("searchResult");
let keys = 0;
let searches = 0;

const search = (query) => {
  searches++;
  searchCount.textContent = searches;
  searchResult.textContent = `Searching for: "${query}"`;
};
const debouncedSearch = debounce(search, 500);

searchInput.addEventListener("input", (event) => {
  keys++;
  keyCount.textContent = keys;
  debouncedSearch(event.target.value);
});

/* ===================== Task 2: Throttle ===================== */
// Runs callback at most once per `delay` ms
const throttle = (callback, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
};

let rawScrolls = 0;
let throttledScrolls = 0;
const scrollRaw = document.getElementById("scrollRaw");
const scrollThrottled = document.getElementById("scrollThrottled");

const onThrottledScroll = () => {
  throttledScrolls++;
  scrollThrottled.textContent = throttledScrolls;
};
const throttledScroll = throttle(onThrottledScroll, 1000);

window.addEventListener("scroll", () => {
  rawScrolls++;
  scrollRaw.textContent = rawScrolls;
  throttledScroll();
});
/*
 Q1. Debounce vs throttle?
 A: Debounce waits until activity STOPS, then runs once. Throttle runs
    regularly during activity, at most once per interval.
 Q2. Which suits search suggestions?  A: Debounce.
 Q3. Which suits scroll/resize?       A: Throttle.
*/

/* ===================== Task 3: Memoization ===================== */
const calculateDiscount = (price, percentage) => price - (price * percentage) / 100;

// The cache lives in a closure, so it persists between calls but stays private
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      addLog("memoLog", `From CACHE: ${key} = ${cache.get(key)}`);
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    addLog("memoLog", `FRESH calculation: ${key} = ${result}`);
    return result;
  };
};

const memoizedDiscount = memoize(calculateDiscount);

document.getElementById("discountBtn").addEventListener("click", () => {
  const price = Number(document.getElementById("priceInput").value);
  const percent = Number(document.getElementById("percentInput").value);
  const result = memoizedDiscount(price, percent);
  document.getElementById("discountResult").textContent = `Final price: ₹${result}`;
});
/*
 Q1. What is memoization?
 A: Caching a function's results by its arguments, so repeated calls with the
    same inputs return the saved result.
 Q2. How does it improve performance?
 A: It skips repeated expensive calculations.
 Q3. Role of closures?
 A: The returned function "remembers" the private `cache` from memoize(), so
    the cache survives between calls without being global.
*/

/* ===================== Task 4a: Event bubbling ===================== */
const bubbleList = document.getElementById("bubbleList");
const stopCheckbox = document.getElementById("stopCheckbox");

// Parent handler: runs when a click bubbles up from a button
bubbleList.addEventListener("click", (event) => {
  addLog(
    "bubbleLog",
    `Parent handler ran (target: ${event.target.tagName}, currentTarget: ${event.currentTarget.tagName})`
  );
});

document.querySelectorAll(".bubble-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    addLog("bubbleLog", "Button clicked");
    if (stopCheckbox.checked) {
      event.stopPropagation(); // parent handler will NOT run
    }
  });
});

/* ===================== Task 4b: Event delegation ===================== */
const productList = document.getElementById("productList");

// ONE listener on the parent handles all current and future Remove buttons
productList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".remove-btn");
  if (!removeBtn) return; // click was not on a Remove button
  removeBtn.closest("li").remove();
});

let newProductCount = 1;
document.getElementById("addProductBtn").addEventListener("click", () => {
  const li = document.createElement("li");
  li.innerHTML = `New Product ${newProductCount++} <button class="remove-btn">Remove</button>`;
  productList.appendChild(li); // works with no extra listener
});
/*
 Q1. Event bubbling?  A: An event fires on the target, then travels UP through
     its parents (button -> li -> ul -> body...).
 Q2. Event delegation? A: Attaching one listener to a parent and using
     event.target to find which child was clicked.
 Q3. Why useful for dynamic elements? A: New elements need no new listeners,
     and fewer listeners means better memory/performance.
 Q4. stopPropagation()? A: Stops the event from bubbling to parent handlers.
 Q5. target vs currentTarget? A: target = the element actually clicked;
     currentTarget = the element the listener is attached to.
*/

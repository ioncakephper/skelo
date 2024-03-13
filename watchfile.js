
// Import the fs module
const fs = require('fs');

// Define the file path to watch
const filePath = './test.txt';

// Define the task to perform when the file changes
const task = () => {
  console.log('The file has changed!');
};

// Define the debounce function to limit the frequency of calling the task
const debounce = (func, delay) => {
  // Initialize a timer variable
  let timer;
  // Return a function that takes the same arguments as the original function
  return (...args) => {
    // Clear the previous timer if any
    clearTimeout(timer);
    // Set a new timer with the given delay
    timer = setTimeout(() => {
      // Call the original function with the arguments
      func(...args);
    }, delay);
  };
};

// Watch the file for changes
fs.watchFile(filePath, { interval: 100 }, debounce(task, 500));
// The interval option specifies how often to check the file for changes in milliseconds
// The debounce parameter specifies how long to wait after a change before calling the task in milliseconds

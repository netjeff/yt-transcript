// content.js
document.body.style.border = '5px solid orange';

// This script will be injected to get the page title and URL.
(() => {
  const text = `${document.title}\n${window.location.href}`;
  navigator.clipboard.writeText(text).then(() => {
    // Optionally, send a message back if needed
  });
})();

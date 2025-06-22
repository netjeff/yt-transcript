// popup.js
document.getElementById('copyBtn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
  document.getElementById('status').textContent = 'Copied!';
});

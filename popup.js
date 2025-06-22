// popup.js
window.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isYouTube = tab.url && tab.url.match(/^https?:\/\/(www\.|m\.|[a-z]{2}\.)?youtube\.com\//i);
  const copyBtn = document.getElementById('copyBtn');
  const status = document.getElementById('status');
  if (!isYouTube) {
    copyBtn.style.display = 'none';
    status.textContent = 'This extension only works on YouTube pages.';
    status.style.color = 'red';
  } else {
    copyBtn.style.display = 'none';
    status.textContent = 'Copied!';
    status.style.color = 'green';
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

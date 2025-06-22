// Listen for clipboard completion or failure from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const status = document.getElementById('status');
  if (message && message.ytTranscriptCopied) {
    status.textContent = 'Copied!';
    status.style.color = 'green';
  } else {
    status.textContent = 'Copy failed. See web console for details.';
    status.style.color = 'red';
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isYouTube = tab.url && tab.url.match(/^https?:\/\/(www\.|m\.|[a-z]{2}\.)?youtube\.com\//i);
  const status = document.getElementById('status');
  if (!isYouTube) {
    status.textContent = 'This extension only works on YouTube pages.';
    status.style.color = 'red';
  } else {
    status.textContent = 'Copying ...';
    status.style.color = 'black';
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

// Listen for clipboard completion or failure from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const status = document.getElementById('status');
  if (message && message.ytTranscriptCopied) {  // from content.js
    status.textContent = 'Copied!';
    status.style.color = 'green';
    setTimeout(() => { window.close(); }, 4000);
  } else if (message && message.ytTranscriptCopyFailed) { // from content.js
    status.textContent = 'Copy failed. See web console for details.';
    status.style.color = 'red';
    setTimeout(() => { window.close(); }, 4000);
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isYouTube = tab.url && tab.url.match(/^https?:\/\/(www\.|m\.|[a-z]{2}\.)?youtube\.com\//i);
  const status = document.getElementById('status');
  if (!isYouTube) {
    status.textContent = 'This extension only works on YouTube pages.';
    status.style.color = 'red';
    setTimeout(() => { window.close(); }, 4000);
  } else {
    status.textContent = 'Copying ...';
    status.style.color = 'black';
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

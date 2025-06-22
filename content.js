// content.js
document.body.style.border = '5px solid orange';

// This script will be injected to get the page title and URL.
(() => {
  const text = `${document.title}\n${window.location.href}`;
  navigator.clipboard.writeText(text).then(() => {
    // Optionally, send a message back if needed
  });
})();

// Copies the page title, URL, and (if on YouTube) the transcript to the clipboard.
(async () => {
  let transcript = '';
  if (window.location.hostname.endsWith('youtube.com')) {
    // Try to find transcript text on the page
    // YouTube transcript is often in ytd-transcript-segment-renderer elements
    const segments = Array.from(document.querySelectorAll('ytd-transcript-segment-renderer'));
    if (segments.length > 0) {
      transcript = segments.map(seg => seg.innerText).join('\n');
    } else {
      // Try fallback: look for transcript text blocks
      const transcriptBlocks = document.querySelectorAll('[class*="transcript"] span');
      if (transcriptBlocks.length > 0) {
        transcript = Array.from(transcriptBlocks).map(e => e.innerText).join(' ');
      }
    }
  }
  const text = `${document.title}\n${window.location.href}${transcript ? '\n\n' + transcript : ''}`;
  await navigator.clipboard.writeText(text);
})();

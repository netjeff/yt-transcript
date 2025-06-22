// Only run on YouTube pages, otherwise show a reminder
if (!window.location.hostname.endsWith('youtube.com')) {
  alert('This extension only works on YouTube pages.');
} else {
  (async () => {
    let transcript = '';
    // Try to find transcript text on the page
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
    const text = `${document.title}\n${window.location.href}${transcript ? '\n\n' + transcript : ''}`;
    await navigator.clipboard.writeText(text);
  })();
}

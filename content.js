function log(msg) { try { console.log('[YT Transcript Extension]', msg); } catch(e) {} }

async function mainLogic() {
    log('Running extension logic...');

    if (!window.location.hostname.endsWith('youtube.com')) {
        alert('This extension only works on YouTube pages.');
        notifyFailure();
        return;
    }
    
    // If transcript is already visible, copy it
    if (await visibleTranscript_ToClipboard()) {
        log('Transcript was already visible, copied to clipboard, done.');
        notifySuccess();
        return;
    }

    // Transcript is not visible, so we need to make it visible first

    // Expand the video description, to get to the show transcript button
    const videoDescription = document.querySelector('div#description');
    if (!videoDescription) {
        log('Could not find description.');
        notifyFailure();
        return;
    }
    const expandDescriptionButton = videoDescription.querySelector('#expand');
    if (!expandDescriptionButton) {
        log('Could not find link/button to expand description.');
        notifyFailure();
        return;
    }
    expandDescriptionButton.click();
    await new Promise(res => setTimeout(res, 500));
    log('Clicked to expand description.');
    
    // Now find and click the button to show transcript
    const transcriptSectionRenderer = videoDescription.querySelector('ytd-video-description-transcript-section-renderer');
    if (!transcriptSectionRenderer) {
        log('Could not find <ytd-video-description-transcript-section-renderer>');
        notifyFailure();
        return;
    }
    const showTranscriptButton = transcriptSectionRenderer.querySelector('button');
    if (!showTranscriptButton) {
        log('Could not find <button> in <ytd-video-description-transcript-section-renderer>');
        notifyFailure();
        return;
    }
    showTranscriptButton.click();
    log('Clicked to show transcript.');

    // Wait for transcript to become visible, then copy to clipboard
    for (let i = 0; i < 8; i++) { // Wait up to 4 seconds (8 x 500ms)
        if (await visibleTranscript_ToClipboard()) {
            log('Transcript became visible and was copied to clipboard.');
            notifySuccess();
            return;
        }
        await new Promise(res => setTimeout(res, 500));
    }
    
    // If we reach here, transcript did not become visible in time
    log('Transcript did not become visible in time.');
    notifyFailure();
}

function notifySuccess() {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ ytTranscriptCopied: true }); // to popup.js
    }
}

function notifyFailure() {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ ytTranscriptCopiedFailed: true }); // to popup.js
    }    
}    

async function visibleTranscript_ToClipboard() {
    const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
    if (transcriptSegments.length < 1) { return false; }
    try {
        await toClipboard_withTitleUrl(transcriptSegments);
        return true;
    } catch (err) {
        log('Failed to copy transcript to clipboard: ' + err);
        return false;
    }
}

async function toClipboard_withTitleUrl(transcriptSegments) {
    const transcript = Array.from(transcriptSegments).map(seg => seg.innerText).join('\n');
    const text = `${document.title}\n${window.location.href}\n\n${transcript}`;
    await navigator.clipboard.writeText(text);
    log('Copied transcript to clipboard.');
}

mainLogic();
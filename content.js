function log(msg) { try { console.log('[YT Transcript Extension]', msg); } catch(e) {} }

async function doit() {
    log('Running extension logic...');

    if (!window.location.hostname.endsWith('youtube.com')) {
        alert('This extension only works on YouTube pages.');
        return;
    }
    
    // If transcript is already visible, copy it
    const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
    if (transcriptSegments.length > 0) {
        log('Transcript already visible, copying to clipboard.');
        await toClipboard_withTitleUrl(transcriptSegments);
        return;
    }
    // Expand the video description if collapsed
    //    FYI:  Using querySelector("#description") does not work, 
    //    because svg elements in DOM often include id="description" and that matches first.
    const videoDescription = document.querySelector('div#description');
    if (!videoDescription) {
        log('Could not find description.');
        return;
    }
    
    log('Found description div');
    console.log(videoDescription.outerHTML);

    const expandDescriptionButton = videoDescription.querySelector('#expand');
    if (!expandDescriptionButton) {
        log('Could not find link/button to expand description.');
        return;
    }
    expandDescriptionButton.click();
    log('Clicked to expand description.');
    await new Promise(res => setTimeout(res, 500));
    
    log('Visually confirm description is expanded');
}


async function toClipboard_withTitleUrl(transcriptSegments) {
    const transcript = Array.from(transcriptSegments).map(seg => seg.innerText).join('\n');
    const text = `${document.title}\n${window.location.href}\n\n${transcript}`;
    await navigator.clipboard.writeText(text);
    log('Copied transcript to clipboard.');
}

doit();
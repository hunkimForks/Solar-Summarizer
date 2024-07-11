import { app, resetStates } from "./app.js";
import { generateOverview } from "./overview.js";

// Define a function that executes when the extension icon is clicked
const extIconOnClick = async (tab) => {
    // Set the content tab ID and URL hash for later use
    app.contentTabId = tab.id;
    app.url = tab.url;

    // Listen for updates to the content tab
    chrome.tabs.onUpdated.addListener(async (contentTabId, changeInfo, tab) => {
        // If the content tab has been initialized before, remove it from the initialized list
        if (app.initialized[contentTabId]) delete app.initialized[contentTabId];
    });

    // If the content tab has been initialized before, display the popup
    if (app.initialized[app.contentTabId]) {
        chrome.tabs.sendMessage(app.contentTabId, 'DISPLAY_POPUP');
        return;
    }
    // Mark the content tab as initialized
    app.initialized[app.contentTabId] = true;

    // Inject content modules into the content tab
    chrome.scripting.executeScript({
        target: { tabId: app.contentTabId },
        files: [
            'content/readability.js',
            'content/marked.js',
            'content/helpers.js',
            'content/popup.js',
            'content/states/error.js',
            'content/states/loading.js',
            'content/states/overview.js',
            'content/states/summary.js',
            'content/states/solar.js',
            'content/states/sse.js',
            'content/states/store.js',
            'content/states/youtube.js',
            'content/content.js',
        ]
    });

}

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener(extIconOnClick);

// Listen for connections from other scripts
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "POPUP") {
        // Otherwise, save the port for the content tab
        app.contentPort = port;
    }

    // Listen for messages from the connected script
    port.onMessage.addListener(async (event) => {
        // Handle different types of messages
        switch (event.type) {
            case 'GET_CONTENT':
                app.contentPort.postMessage({ type: 'IN_GET_CONTENT' });
                break;

            case 'GENERATE_SUMMARY':
                // Generate an overview of the content
                const { overviewTime, overviewWords, contentText } = await generateOverview(event.props.content, event.props.youtubeTranscript);
                if (app.states.error) app.contentPort.postMessage({ type: 'ERROR', props: { error: app.error } });
                if (app.states.overview) app.contentPort.postMessage({ type: 'IN_SUMMARY', props: { time: overviewTime, words: overviewWords, content: contentText } });
                break;
        }
        // Reset the app states
        resetStates();
    });
});
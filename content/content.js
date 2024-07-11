// This function is called when first-click on extension icon in the current tab
const run = async () => {
    // Add a stylesheet to the current document
    addStylesheet(document, 'assets/css/main.css');
    // Create the main extension popup
    createMainPopup();
    // Show the loading state
    showLoadingState();
}
run();

// Establishe a connection and send the first message to the background
const port = chrome.runtime.connect({ name: "POPUP" });
port.postMessage({ type: 'GET_CONTENT' });

// Listen for messages on the background.
port.onMessage.addListener(async (state) => {
    // Handle different message types and executes code based on the message received
    switch (state.type) {
        case 'IN_GET_CONTENT': // 'AUTHORIZED':
            showLoadingState();
            const pageContent = getPageContent();
            const youtubeTranscript = await getYoutubeTranscript();
            port.postMessage({ type: 'GENERATE_SUMMARY', props: { content: pageContent, youtubeTranscript: youtubeTranscript } });
            break;

        case 'IN_SUMMARY':
            showOverviewState(state.props.time, state.props.words, state.props.content, (element) => {
                getSolarSummary(state.props.content, element);

            });
            break;
        // If the message type is "ERROR", this code shows an error state with the provided error message
        case 'ERROR':
            showErrorState('Error: ' + state.props.error);
            console.log('Error:', state.props.error);
            break;
    }
});

// Listen for runtime messages on the background.
chrome.runtime.onMessage.addListener(async (action) => {
    // Display the main popup when the user closes it once and clicks on the extension icon again
    if (action == 'DISPLAY_POPUP') {
        displayMainPopup();
        if (port) {
            port.postMessage({ type: 'GET_CONTENT' });
        }
    }
});
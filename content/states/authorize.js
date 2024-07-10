// Display authorization state
const showAuthorizeState = (callback) => {
    // Return if main popup not exists
    if (!document.querySelector('.gpts .gpts-content')) return;

    // Create authorize state DOM and put it inside the popup content
    const dom = `<div class="gpts-authorize">
                    <p>
                        Please input Solar API key to summarize.
                        <input type="password" class="gpts-api-key" placeholder="API Key" />
                        <br>
                        Get your API key from <a href="https://console.upstage.ai/" target="_blank">Upstage Concole</a>.
                    </p>
                </div>`;
    document.querySelector('.gpts .gpts-content').innerHTML = dom;

    // Add an event listener for click on ChatGPT tab link that calls a callback function
    dynamicDomEvent('click', '.gpts-auth-link', () => {
        callback();
    });
}
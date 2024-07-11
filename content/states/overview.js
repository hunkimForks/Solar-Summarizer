// Display overview state
const showOverviewState = async (time, words, content, callback) => {
    // Return if main popup not exists
    if (!document.querySelector('.gpts .gpts-content')) return;

    const api_key_promise = await get_key_from_localstorage();
    const api_key = api_key_promise.solar_api_key;
    const prompt_promise = await get_prompt_from_localstorage();
    const prompt = prompt_promise.solar_prompt?prompt_promise.solar_prompt:default_prompt;


    // Create overview state DOM and put it inside the popup content
    const dom = `<div class="gpts-overview">
                    <div id="gpts-setting-icon" class="gpts-setting-btn">
                    ⚙️ Setting
                    </div>
                    <div id="gpts-setting" class="gpts-authorize">
                        <p>
                            <p>Solar API Key: </p>
                            <input id="solar-api-key-value" type="password" value="${api_key}" size=50/>
                            <p>
                            Get your API key from <a href="https://console.upstage.ai/" class="gpts-auth-link" target="_blank">Upstage Concole</a>.
                            </p>
                        </p>
                        <p>
                            <p>Prompt: </p>
                            <textarea id="solar-prompt" rows="4" cols="50">${prompt}</textarea>
                        </p>
                        <div id="seting-msg" class="gpts-setting-msg">
                        </div>
                        <div class="gpts-generate-btn">
                            Store
                        </div>
                       
                        <p/>
                    </div>

                    <p>
                        The content is <b>${time} min read (about ${words} words)</b>.
                    </p>
                   
                        <!--
                    <div class="gpts-summary-mode">
                        <p>Summary Mode: </p>
                        <select id="gpts-summary-mode">
                            <option value="general">General</option>
                            <option value="bullet">Bullet-Points</option>
                        </select>
                    </div>
                    <div class="gpts-generate-btn">
                        Summarize
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27 16V22" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24 19H30" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.5 5V10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 7.5H13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21 23V27" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M19 25H23" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path style="stroke: #974bea;"
                                d="M23.2929 4.70711L4.70711 23.2929C4.31658 23.6834 4.31658 24.3166 4.70711 24.7071L7.29289 27.2929C7.68342 27.6834 8.31658 27.6834 8.70711 27.2929L27.2929 8.70711C27.6834 8.31658 27.6834 7.68342 27.2929 7.29289L24.7071 4.70711C24.3166 4.31658 23.6834 4.31658 23.2929 4.70711Z"
                                stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                            <path style="stroke: #974bea;" d="M18 10L22 14" stroke="black" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    -->
                    <div class="gpts-summary-text" id="solar-summary">
                    </div>
                    <div id="refresh-btn" class="gpts-refresh-btn">🔄 regenerate</div>
                </div>`;

   

    document.querySelector('.gpts .gpts-content').innerHTML = dom;

    if (get_key_from_localstorage()) {
        document.getElementById('gpts-setting').style.display = 'none';
    }
    const solarSummaryElement = document.getElementById('solar-summary');
    callback(solarSummaryElement);

    if (solarSummaryElement.innerHTML.startsWith('Error:')) {
        console.log('HMM Error:', solarSummaryElement.innerHTML);
    }

    // Add an event listener for click on summarize button that calls a callback function
    dynamicDomEvent('click', '.gpts-generate-btn', () => {
        msg_emelement = document.getElementById('seting-msg');
        try {
            const api_key = document.getElementById('solar-api-key-value').value;
            const lang = document.getElementById('solar-prompt').value;
            set_key_to_localstorage(api_key);
            set_prompt_to_localstorage(lang);
            msg_emelement.innerHTML = "Setting saved!";
        } catch (e) {
            console.log('Error:', e);
            msg_emelement.innerHTML = "Error: " + e;
        }
    
        callback(solarSummaryElement);

    });

     // Add an event listener for click on summarize button that calls a callback function
     dynamicDomEvent('click', '#gpts-setting-icon', () => {
        if (document.getElementById('gpts-setting').style.display === 'none') {
            document.getElementById('gpts-setting').style.display = 'block';
        } else {
            document.getElementById('gpts-setting').style.display = 'none';
        }
    });

    // Add an event listener for click on summarize button that calls a callback function
    dynamicDomEvent('click', '#refresh-btn', () => {
        callback(solarSummaryElement);
    });
}

// Get page content instance with Readability package
const getPageContent = () => {
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();

    return article;
}
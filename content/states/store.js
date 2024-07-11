const default_prompt = `Summarize this content in brief in TLDR manner (less than 3 lines) in English.`

const set_key_to_localstorage = (key) => {
    chrome.storage.local.set({ solar_api_key: key });
}

const set_prompt_to_localstorage = (prompt) => {
    chrome.storage.local.set({ solar_prompt: prompt });
}

const get_key_from_localstorage = () => {
    return chrome.storage.local.get(['solar_api_key'])
}

const get_prompt_from_localstorage = () => {
    return chrome.storage.local.get(['solar_prompt'])
}

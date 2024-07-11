const getSolarSummary = async (content, element) => {
    // Clear the element
    element.innerHTML = "";

    const api_key_dict = await get_key_from_localstorage();
    const prompt_promise = await get_prompt_from_localstorage();
    const prompt = prompt_promise.solar_prompt?prompt_promise.solar_prompt:default_prompt;


    return new Promise((resolve, reject) => {

        if (!api_key_dict || !api_key_dict.solar_api_key) {
            element.innerHTML = "Error: API key not found!";
            reject("API key not found!");
            return;
        }

        const api_key = api_key_dict.solar_api_key;


        // Use SSE to get the summary
        const eventSource = SSE('https://api.upstage.ai/v1/solar/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + api_key,
            },
            payload: JSON.stringify({
                model: "solar-1-mini-chat",
                messages: [
                    {
                        "role": "system",
                        "content": prompt
                    },
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                stream: true,
            }),
        });

        eventSource.onmessage = function (event) {
            if (!event.data || event.data == "[DONE]") {
                eventSource.close();
                resolve(event)
                return;
            }
            const result = JSON.parse(event.data);
            const delta_text = result['choices'][0]['delta']['content'];
            if (delta_text) {
                element.innerHTML += delta_text;
            }
        };

        eventSource.onerror = function (event) {
            element.innerHTML = "Error: " + event + '\nPlease check out the API key in the settings.';
            console.error('Error:', event);
            eventSource.close();
            reject(event);
        };

        eventSource.stream();

        //element.innerHTML = "Solar Summary";
        resolve(content);
    });
};



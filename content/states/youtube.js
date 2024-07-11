const getYoutubeTranscript = async () => {
    // get current URL from document
    const url = document.URL;
    // check if the URL is a youtube video
    if (url.includes('youtube.com/watch')) {
        // get the video ID
        const videoId = getSearchParam(url);
        if (videoId && videoId['v']) {
            // get the transcript
            const langOptions = await getLangOptionsWithLink(videoId['v']);
            if (langOptions) {
                const transcript = await getTranscript(langOptions[0]);
                console.log(transcript);
                return transcript;
            }
        }
    }

    return "";
}

async function getLangOptionsWithLink(videoId) {

    // Get a transcript URL
    const videoPageResponse = await fetch("https://www.youtube.com/watch?v=" + videoId);
    const videoPageHtml = await videoPageResponse.text();
    const splittedHtml = videoPageHtml.split('"captions":')

    if (splittedHtml.length < 2) { return; } // No Caption Available

    const captions_json = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));
    const captionTracks = captions_json.playerCaptionsTracklistRenderer.captionTracks;
    const languageOptions = Array.from(captionTracks).map(i => { return i.name.simpleText; })

    const first = "English"; // Sort by English first
    languageOptions.sort(function (x, y) { return x.includes(first) ? -1 : y.includes(first) ? 1 : 0; });
    languageOptions.sort(function (x, y) { return x == first ? -1 : y == first ? 1 : 0; });

    return Array.from(languageOptions).map((langName, index) => {
        const link = captionTracks.find(i => i.name.simpleText === langName).baseUrl;
        return {
            language: langName,
            link: link
        }
    })

}

async function getTranscript(langOption) {
    const rawTranscript = await getRawTranscript(langOption.link);
    const transcript = rawTranscript;
    return transcript;
}

async function getRawTranscript(link) {

    // Get Transcript
    const transcriptPageResponse = await fetch(link); // default 0
    const transcriptPageXml = await transcriptPageResponse.text();

    return transcriptPageXml;
}


function getSearchParam(url) {

    const searchParam = url;

    if (!(/\?([a-zA-Z0-9_]+)/i.exec(searchParam))) return {};
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^?&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        index = /\?([a-zA-Z0-9_]+)/i.exec(searchParam)["index"] + 1,
        query = searchParam.substring(index);

    let urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
}
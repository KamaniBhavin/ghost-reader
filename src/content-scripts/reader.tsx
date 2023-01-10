import "./styles.css"
import {extract} from "../helpers/Extractor";
import {createEmbeddingsForLines} from "../helpers/Embeddor";
import {summarize} from "../helpers/Summarizer";
import {findTopSearchMatch} from "../helpers/SearchQueryProcessor";
import {embedSalaryIntoPage} from "./Summary";

// This is the main entry point for the content script
const textElements = extract(document);

// Cache the embeddings, so we don't have to recompute them every time
const pageEmbeddings = createEmbeddingsForLines(textElements);

// Find the top search match
async function search(request) {
    const result = await findTopSearchMatch(request.search, pageEmbeddings);

    // Low confidence means we couldn't find a good match
    if (result.similarity < 0.75) {
        return {lowConfidence: true}
    }

    result.element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    result.element.style.backgroundColor = "yellow";
    return {error: false}
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async function () {
        switch (request.type) {
            case "search":
                sendResponse(await search(request));
                break;
            case "summarize":
                const textToSummarize = textElements.map(e => e.text).join(" ");
                const summary = await summarize(textToSummarize);
                embedSalaryIntoPage(summary);

                sendResponse({error: false});
                break;
            default:
                sendResponse({error: true})
                break;
        }
    })();
    return true;
});

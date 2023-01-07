import {computeCosineSimilarityBetween} from "../helpers/math";
import {createEmbeddings} from "../helpers/openAI";
import {Embedding, TextElement} from "../helpers/types";

const textElements = Array.from(document.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, span"))
    .map(e => e as HTMLElement)
    .filter((element) => element.innerText.split(" ").length > 5)
    .map((element, index) => {
        return {
            index,
            element,
            text: element.innerText,
        }
    });

const pageEmbeddings = (async function createEmbeddingsForLines(textElements: TextElement[]): Promise<Embedding[]> {
        console.info("Computing embeddings for complete page!")

        const lines = textElements.map(e => e.text)

        if (!lines || lines.length === 0) {
            return [];
        }

        const embeddings = await createEmbeddings(lines);

        return embeddings.data.map((e) => ({
            element: textElements[e.index].element,
            line: textElements[e.index].text,
            embedding: e.embedding,
        }));
    }
)(textElements);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async function () {
        const searchEmbedding = (await createEmbeddings(request.search)).data[0].embedding;

        const similarities = (await pageEmbeddings).map((e) => {
            return {
                ...e,
                similarity: computeCosineSimilarityBetween(e.embedding, searchEmbedding)
            }
        }).sort((a, b) => b.similarity - a.similarity);

        const topSimilarity = similarities[0];

        console.info("Top similarity", topSimilarity);

        if (topSimilarity.similarity < 0.75) {
            sendResponse({lowConfidence: true});
        } else {
            topSimilarity.element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            topSimilarity.element.style.backgroundColor = "yellow";
            sendResponse({error: false})
        }

    })();
    return true;
});

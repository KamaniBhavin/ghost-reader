import {OpenAICompletionResponse} from "./types";
import {createCompletion} from "./OpenAI";


/**
 * It will create a summary for the given text. It will use the OpenAI API.
 * The size of the summary will be 1/5 of the size of the text or 180 which ever is smaller.
 *
 * @param text The text to create a summary for (max: 2048 characters).
 * @returns The summary.
 */
export async function summarize(text: string): Promise<OpenAICompletionResponse> {
    const contentLength = text.length;
    const completionLength = Math.min(180, Math.round(text.split(" ").length / 5));
    const totalLength = contentLength + completionLength;

    // This is to be within the OpenAI API limits.
    if (totalLength > 3000) {
        text = text.substring(0, 3000 - completionLength);
    }

    return createCompletion(`Summarize: ${text}`, completionLength);
}
export type OpenAIEmbeddingResponse = {
    object: string,
    model: string,
    usage: Usage,
    data: EmbeddingData[],
    error: string | null,
}

interface EmbeddingData {
    object: string,
    embedding: number[]
    index: number

}

interface Usage {
    prompt_tokens: number,
    total_tokens: number,
}

export async function createEmbeddings(input: string | string[]): Promise<OpenAIEmbeddingResponse> {
    const {key} = await chrome.storage.sync.get('key');

    if (!key) {
        console.error('No OpenAI API key found');
        return {
            object: 'error',
            model: '',
            usage: {
                prompt_tokens: 0,
                total_tokens: 0,
            },
            data: [],
            error: 'No OpenAI API key found in storage',
        }
    }

    return getEmbeddings(key, input);
}

export async function getEmbeddings(key: string, input: string | string[]): Promise<OpenAIEmbeddingResponse> {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
            "input": input,
            "model": "text-embedding-ada-002"
        })
    })

    if (response.status !== 200) {
        console.error('OpenAI API error', JSON.stringify(await response.json()));
        return {
            object: 'error',
            model: '',
            usage: {
                prompt_tokens: 0,
                total_tokens: 0,
            },
            data: [],
            error: `OpenAI API error: ${response.status}`,
        }
    }

    return response.json();
}
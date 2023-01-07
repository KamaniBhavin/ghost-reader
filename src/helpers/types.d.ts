export interface TextElement {
    index: number,
    element: HTMLElement,
    text: string,
}

export interface Embedding {
    element: HTMLElement,
    line: string,
    embedding: number[],
}


export interface EmbeddingResponse {
    error: boolean,
    message: string,
    lowConfidence: boolean,
}
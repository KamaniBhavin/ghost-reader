export function computeCosineSimilarityBetween(x: number[], y: number[]) {
    const dotProductXY = x.map((val, i) => val * y[i]).reduce((accum, curr) => accum + curr, 0);
    const magnitudeX = computeMagnitudeOfAVector(x);
    const magnitudeY = computeMagnitudeOfAVector(y);

    return dotProductXY / (magnitudeX * magnitudeY);
}

function computeMagnitudeOfAVector(v: number[]) {
    return Math.sqrt(v.reduce((accum, curr) => accum + Math.pow(curr, 2), 0));
}
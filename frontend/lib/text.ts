import { Document, TermType } from "@/actions/searchAction";

export function clampText(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
}
export function getMostFrequentTerms(doc: Document): TermType[] {
    // Aggregate duplicates in the posting list
    const aggregatedPostingList: { [wordId: string]: number } = {};
    doc.postingList.forEach((term) => {
        if (aggregatedPostingList[term.wordId]) {
            aggregatedPostingList[term.wordId] += term.termFrequency;
        } else {
            aggregatedPostingList[term.wordId] = term.termFrequency;
        }
    });

    // Convert the aggregated object back to an array of TermType
    const aggregatedArray: TermType[] = Object.entries(
        aggregatedPostingList
    ).map(([wordId, termFrequency]) => ({
        wordId,
        termFrequency,
    }));

    // Sort the aggregated array by term frequency in descending order
    const sortedAggregatedArray = aggregatedArray.sort(
        (a, b) => b.termFrequency - a.termFrequency
    );

    // Return the top 5 most frequent terms
    return sortedAggregatedArray.slice(0, 5);
}

"use server";

import {
    getBodyMatches,
    getTermsFrequencies,
    getTitleMatches,
} from "@/data/terms";
import { StopStem } from "@/lib/stemmer";
import { getMostFrequentTerms } from "@/lib/text";
import { SearchTermType, searchTermSchema } from "@/schemas";

export type TermType = {
    wordId: string;
    termFrequency: number;
};

export type Document = {
    id: string;
    postingList: TermType[];
    pageInfo: any;
};

type ScoredDocument = {
    id: string;
    score: number;
    pageInfo: any;
    keywords: TermType[];
};

function calculateTermFrequencies(terms: string[]): Map<string, number> {
    const termFrequencies = new Map<string, number>();
    terms.forEach((term) => {
        termFrequencies.set(term, (termFrequencies.get(term) || 0) + 1);
    });
    return termFrequencies;
}

function normalizeTermFrequencies(
    termFrequencies: Map<string, number>
): Map<string, number> {
    const maxFrequency = Math.max(...Array.from(termFrequencies.values()));
    const normalizedTermFrequencies = new Map<string, number>();

    termFrequencies.forEach((frequency, wordId) => {
        normalizedTermFrequencies.set(wordId, frequency / maxFrequency);
    });

    return normalizedTermFrequencies;
}

function normalizeByIDF(
    termFrequencies: Map<string, number>,
    termGlobalFrequencies: Map<string, number>
): Map<string, number> {
    const normalizedTermFrequencies = new Map<string, number>();

    termFrequencies.forEach((frequency, wordId) => {
        normalizedTermFrequencies.set(
            wordId,
            frequency / (termGlobalFrequencies.get("wordId") ?? 1)
        );
    });

    return normalizedTermFrequencies;
}

function calculateDocFrequencies(
    terms: { wordId: string; termFrequency: number }[]
): Map<string, number> {
    const termFrequencies = new Map<string, number>();
    terms.forEach((term) => {
        termFrequencies.set(
            term.wordId,
            (termFrequencies.get(term.wordId) || 0) + term.termFrequency
        );
    });
    return termFrequencies;
}

function calculateCosineSimilarity(
    queryVector: Map<string, number>,
    documentVector: Map<string, number>
): number {
    let dotProduct = 0;
    let queryVectorLength = 0;
    let documentVectorLength = 0;

    queryVector.forEach((queryWeight, term) => {
        const documentWeight = documentVector.get(term) || 0;
        dotProduct += queryWeight * documentWeight;
        queryVectorLength += queryWeight ** 2;
        documentVectorLength += documentWeight ** 2;
    });

    if (queryVectorLength === 0 || documentVectorLength === 0) {
        return 0;
    }

    return (
        dotProduct /
        (Math.sqrt(queryVectorLength) * Math.sqrt(documentVectorLength))
    );
}

function vectorSpaceModel(
    queryTerms: string[],
    documents: any[],
    termGlobalFrequencies: Map<string, number>
): ScoredDocument[] {
    // Calculate term frequencies for the query
    const queryTermFrequencies = calculateTermFrequencies(queryTerms);

    // Calculate term frequencies for the documents
    const documentTermFrequencies: Map<string, Map<string, number>> = new Map();
    documents.forEach((document) => {
        documentTermFrequencies.set(
            document.id,
            normalizeByIDF(
                // normalize by max freq within doc
                normalizeTermFrequencies(
                    calculateDocFrequencies(document.postingList)
                ),
                termGlobalFrequencies
            )
        );
    });

    // Calculate cosine similarity between the query and document vectors
    const scoredDocuments: ScoredDocument[] = [];
    documents.forEach((document) => {
        const documentId = document.id;
        const documentVector =
            documentTermFrequencies.get(documentId) || new Map();
        const cosineSimilarity = calculateCosineSimilarity(
            queryTermFrequencies,
            documentVector
        );
        scoredDocuments.push({
            id: documentId,
            score: cosineSimilarity,
            pageInfo: document.pageInfo,
            keywords: getMostFrequentTerms(document),
        });
    });

    // Sort the documents by their cosine similarity scores in descending order
    scoredDocuments.sort((a, b) => b.score - a.score);

    return scoredDocuments;
}

export const searchAction = async (values: SearchTermType) => {
    const validatedFields = searchTermSchema.safeParse(values);

    if (!validatedFields.data?.query) {
        return { error: "Search term can't be empty" };
    }

    try {
        const { query: searchQuery } = validatedFields.data;

        // const unstemmed_tokens = parseTokens(searchQuery);
        const tokens = StopStem(searchQuery);

        const titleMatches = (await getTitleMatches(tokens)) || [];
        const bodyMatches = (await getBodyMatches(tokens)) || [];

        const termGlobalFrequencies: Map<string, number> =
            await getTermsFrequencies(tokens);

        // matches in title are 2x as relevant (by duplicating the query terms)
        const titleResults = vectorSpaceModel(
            [...tokens, ...tokens],
            titleMatches,
            termGlobalFrequencies
        ).filter((result) => result.score > 0);

        const bodyResults = vectorSpaceModel(
            tokens,
            bodyMatches,
            termGlobalFrequencies
        ).filter((result) => result.score > 0);

        // combine results and remove duplicates
        const allResults = [...titleResults, ...bodyResults];
        const uniqueIds = Array.from(new Set(allResults.map((obj) => obj.id)));
        const uniqueList = uniqueIds.map((id) =>
            allResults.find((obj) => obj.id === id)
        );

        console.log("all res::", allResults);
        return { results: uniqueList.slice(0, 50) || [] };
    } catch (e) {
        return { error: "Something went wrong!" };
    }
};

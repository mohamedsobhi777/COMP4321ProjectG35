import { db } from "@/lib/db";
import { getDocsFromLinks } from "./docs";

export const getTermInPageBody = async (searchTerm: string) => {
    try {
        const pagesList = await db.invertedTableBody.findUnique({
            where: {
                id: searchTerm,
            },
        });
        return [pagesList];
    } catch (e) {
        console.log("[DB_QUERY ERROR", e);
        return null;
    }
};

export const getTitleMatches = async (queryTokens: string[]) => {
    try {
        const pagesList = await db.invertedTableTitle.findMany({
            where: {
                id: {
                    in: queryTokens,
                },
            },
        });

        const titleMatches: { docId: string; termFrequency: number }[] =
            pagesList.flatMap((page) => page.postingList) as {
                docId: string;
                termFrequency: number;
            }[];
        const uniqueDocIds = new Set(titleMatches.map((title) => title.docId));
        const uniqueDocIdsArray = Array.from(uniqueDocIds);
        return await getDocsFromLinks(uniqueDocIdsArray);
    } catch (e) {
        console.log("[DB_QUERY ERROR]", e);
        return null;
    }
};

export const getBodyMatches = async (queryTokens: string[]) => {
    try {
        const pagesList = await db.invertedTableBody.findMany({
            where: {
                id: {
                    in: queryTokens,
                },
            },
        });

        const bodyMatches: { docId: string; termFrequency: number }[] =
            pagesList.flatMap((page) => page.postingList) as {
                docId: string;
                termFrequency: number;
            }[];
        const uniqueDocIds = new Set(bodyMatches.map((body) => body.docId));
        const uniqueDocIdsArray = Array.from(uniqueDocIds);
        return await getDocsFromLinks(uniqueDocIdsArray);
    } catch (e) {
        console.log("[DB_QUERY ERROR]", e);
        return null;
    }
};

export const getTermsFrequencies = async (terms: string[]) => {
    try {
        const termsList = await db.invertedTableBody.findMany({});

        // @ts-ignore
        const termsFreqs: {
            termId: string;
            postingList: { docId: string; termFrequency: number }[];
        }[] = termsList.map((term) => ({
            termId: term.id,
            postingList: term.postingList,
        }));

        // sum the frequencies accross all the docs
        const returnValue: Map<string, number> = new Map();

        termsFreqs.forEach((term) => {
            returnValue.set(
                term.termId,
                term.postingList.reduce(
                    (
                        accumulator: number,
                        currentValue: { docId: string; termFrequency: number }
                    ) => accumulator + currentValue.termFrequency,
                    0
                )
            );
        });

        return returnValue;
    } catch (e) {
        console.log("[DB_QUERY ERROR]", e);
        return new Map();
    }
};

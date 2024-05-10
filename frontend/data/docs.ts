import { db } from "@/lib/db";

export const getAllDocs = async () => {
    try {
        const pagesList = await db.forwardTable.findMany({
            include: {
                pageInfo: {
                    select: {
                        Title: true,
                        lastModifiedDate: true,
                        PageSize: true,
                        LastCrawledDate: true,
                        ChildLink: true,
                        parentLink: true,
                    },
                },
            },
        });
        return pagesList;
    } catch (e) {
        console.log("[DB_QUERY ERROR]", e);
        return null;
    }
};

export const getDocsFromLinks = async (links: string[]) => {
    try {
        const pagesList = await db.forwardTable.findMany({
            where: {
                id: {
                    in: links,
                },
            },
            include: {
                pageInfo: {
                    select: {
                        Title: true,
                        lastModifiedDate: true,
                        PageSize: true,
                        LastCrawledDate: true,
                        ChildLink: true,
                        parentLink: true,
                    },
                },
            },
        });
        return pagesList;
    } catch (e) {
        console.log("[DB_QUERY ERROR]", e);
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

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

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

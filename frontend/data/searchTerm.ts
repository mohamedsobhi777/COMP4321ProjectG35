
// deprecated
import { db } from "@/lib/db";

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

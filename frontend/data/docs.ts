import { db } from "@/lib/db";

export const getAllDocs = async () => {
    try {
        const pagesList = await db.forwardTable.findMany();
        return pagesList;
    } catch (e) {
        console.log("[DB_QUERY ERROR", e);
        return null;
    }
};

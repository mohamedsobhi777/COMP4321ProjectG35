"use server";

import { getTermInPageBody } from "@/data/searchTerm";
import { SearchTermType, searchTermSchema } from "@/schemas";

export const searchAction = async (values: SearchTermType) => {
    const validatedFields = searchTermSchema.safeParse(values);

    if (!validatedFields.data?.query) {
        return { error: "Search term can't be empty" };
    }

    const { query: searchQuery } = validatedFields.data;

    try {
        const relevantPages = await getTermInPageBody(searchQuery);
        return { result: relevantPages };
    } catch (e) {
        return { error: "Something went wrong!" };
    }
};

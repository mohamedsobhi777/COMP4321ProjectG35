import { z } from "zod";

export const searchTermSchema = z.object({
    query: z.string().min(1, {
        message: "Search term can't be empty",
    }),
});

export type SearchTermType = z.infer<typeof searchTermSchema>;

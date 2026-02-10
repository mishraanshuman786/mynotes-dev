import {z} from "zod";

export const createBlogSchema=z.object({
    title: z.string().min(3,"Title is too short.").max(150,"Title is too large."),
    slug:z.string().min(3).max(150).regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"),
    content_json:z.any(),
    content_html: z.string().min(1),
    category_id: z.string().uuid().nullable().optional(),
    status: z.enum(["draft","published"]).default("draft")
})
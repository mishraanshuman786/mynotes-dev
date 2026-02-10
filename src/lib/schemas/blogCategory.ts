import {z} from "zod";

export const createBlogCategorySchema=z.object({
    name:z.string().min(2,"Category Name is too short!").max(100,"Category Name is too Long!"),
    slug:z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be kebab-case")
})
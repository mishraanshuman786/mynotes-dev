import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title is too short.")
    .max(150, "Title is too large."),

  slug: z
    .string()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"),

  content_json: z.any(), // You can improve later if needed

  content_html: z
    .string()
    .min(1, "Content cannot be empty."),

  category_id: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  tags: z
  .array(z.string().min(1).max(50))
  .transform(tags =>
    tags.map(tag =>
      tag.toLowerCase().replace(/\s+/g, "-")
    )
  )
  .optional()
});
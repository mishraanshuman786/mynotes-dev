"use server";

import { supabase } from "@/lib/supabase/server";
import { createBlogCategorySchemaFrontend, updateCategorySchema } from "@/lib/schemas/blogCategory";



/* ===============================
   Create Category
================================ */
export async function createBlogCategory(rawInput: unknown) {
  const parsed = createBlogCategorySchemaFrontend.safeParse(rawInput);

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Invalid Category Input!");
  }

  const { name, slug } = parsed.data;
let updatedSlug="";
  // Auto generate slug if not provided
  if (!slug) {
    updatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
  else{
      updatedSlug=slug;
  }

 

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug: updatedSlug.toLowerCase() })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

/* ===============================
   Update Category
================================ */
export async function updateBlogCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!id || !name?.trim()) {
    throw new Error("Invalid Category Input!");
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const parsed = updateCategorySchema.safeParse({
    name,
    slug,
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Invalid Category Input!");
  }

  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/* ===============================
   Delete Category
================================ */
export async function deleteBlogCategory(id: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/* ===============================
   Get All Categories
================================ */
export async function getBlogCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
}
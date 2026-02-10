"use server";

import { supabase } from "@/lib/supabase/server";
import { createBlogCategorySchema } from "@/lib/schemas/blogCategory";

// create a new blog category
export async function createBlogCategory(rawInput:unknown){
   const parsed=createBlogCategorySchema.safeParse(rawInput);

   if(!parsed.success){
    console.error(parsed.error.flatten());
    throw new Error("Invalid Category Input!");
   }

   const {name,slug}=parsed.data;
   const {data,error}=await supabase.from("categories").insert({name,slug:slug.toLowerCase()}).select().single();

   if(error){
    throw new Error(error.message);
   }

   return data;
}


// get all blog categories
export async function getBlogCategories(){
    const {data,error}=await supabase.from("categories").select("id, name, slug").order("name",{ascending:true});

    if(error){
         throw new Error(error.message);
    }

    return data;
}

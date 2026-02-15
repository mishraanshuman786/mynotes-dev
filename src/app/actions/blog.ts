"use server";
import { supabase } from "@/lib/supabase/server";
import {createBlogSchema} from "@/lib/schemas/blog";


export async function saveBlog(rawInput:unknown){
    const parsed=createBlogSchema.safeParse(rawInput);
    if(!parsed.success){
        console.error(parsed.error.flatten());
        throw new Error("Invalid blog input!");
    }

    const {title, slug, content_json, content_html, category_id,tags}=parsed.data;

    const {data,error}=await supabase.from("blogs").insert({
        title,
        slug: slug.toLowerCase(),
        content_json,
        content_html,
        category_id,
        tags
    }).select().single();

    if(error){
        throw new Error(error.message);
    }

    return data;
    
}

export async function getBlogs(){
    const {data,error}=await supabase.from("blogs").select(`id,title,slug,content_html,tags,created_at,categories(id,name,slug)`).order("created_at",{ascending:false});

    if(error){
        console.error("Error fetching blogs: ", error.message);
        throw new Error("Error Fetching blogs!");

       
    }

    // Transform categories array to single object (Supabase returns joins as arrays)
    const transformedData = data?.map(blog => ({
        ...blog,
        categories: Array.isArray(blog.categories) && blog.categories.length > 0 
            ? blog.categories[0] 
            : null
    })) ?? [];

     return transformedData;
}
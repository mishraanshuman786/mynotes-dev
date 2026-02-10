"use server";
import { supabase } from "@/lib/supabase/server";
import {createBlogSchema} from "@/lib/schemas/blog";


export async function saveBlog(rawInput:unknown){
    const parsed=createBlogSchema.safeParse(rawInput);
    if(!parsed.success){
        console.error(parsed.error.flatten());
        throw new Error("Invalid blog input!");
    }

    const {title, slug, content_json, content_html, category_id,status}=parsed.data;

    const {data,error}=await supabase.from("blogs").insert({
        title,
        slug: slug.toLowerCase(),
        content_json,
        content_html,
        category_id,
        status
    }).select().single();

    if(error){
        throw new Error(error.message);
    }

    return data;
    
}
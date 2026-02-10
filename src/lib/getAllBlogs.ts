import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import readingTime from 'reading-time';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blogs');

/**
 * Get all blog posts from the content directory
 * Reads all .mdx files from category subdirectories
 */
export function getAllBlogs(): BlogPost[] {
  const blogs: BlogPost[] = [];
  
  // Check if content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    return blogs;
  }

  // Get all category directories
  const categories = fs.readdirSync(CONTENT_DIR).filter((dir) => {
    const fullPath = path.join(CONTENT_DIR, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  // Read all blog files from each category
  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIR, category);
    const files = fs.readdirSync(categoryPath).filter((file) => 
      file.endsWith('.mdx') || file.endsWith('.md')
    );

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      // Calculate reading time
      const stats = readingTime(content);
      
      // Generate slug from filename if not in front-matter
      const slug = data.slug || file.replace(/\.mdx?$/, '');

      blogs.push({
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        category: data.category || category,
        tags: data.tags || [],
        slug,
        readingTime: data.readingTime || stats.text,
        coverImage: data.coverImage,
        author: data.author || 'Anonymous',
        published: data.published !== false, // Default to true if not specified
        content,
        rawContent: fileContent,
      });
    }
  }

  // Sort by date (newest first)
  return blogs
    .filter((blog) => blog.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get blogs by category
 */
export function getBlogsByCategory(category: string): BlogPost[] {
  const allBlogs = getAllBlogs();
  return allBlogs.filter(
    (blog) => blog.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get blogs by tag
 */
export function getBlogsByTag(tag: string): BlogPost[] {
  const allBlogs = getAllBlogs();
  return allBlogs.filter((blog) =>
    blog.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allBlogs = getAllBlogs();
  const tags = new Set<string>();
  
  allBlogs.forEach((blog) => {
    blog.tags.forEach((tag) => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

/**
 * Search blogs by title or content
 */
export function searchBlogs(query: string): BlogPost[] {
  const allBlogs = getAllBlogs();
  const lowerQuery = query.toLowerCase();
  
  return allBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.description.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

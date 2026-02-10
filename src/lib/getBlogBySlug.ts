import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';
import readingTime from 'reading-time';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blogs');

/**
 * Get a single blog post by its slug
 * Searches through all category directories
 */
export function getBlogBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(CONTENT_DIR)) {
    return null;
  }

  // Get all category directories
  const categories = fs.readdirSync(CONTENT_DIR).filter((dir) => {
    const fullPath = path.join(CONTENT_DIR, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  // Search for the blog in each category
  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIR, category);
    const files = fs.readdirSync(categoryPath).filter((file) =>
      file.endsWith('.mdx') || file.endsWith('.md')
    );

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const fileSlug = data.slug || file.replace(/\.mdx?$/, '');
      
      if (fileSlug === slug) {
        const stats = readingTime(content);
        
        return {
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || new Date().toISOString(),
          category: data.category || category,
          tags: data.tags || [],
          slug: fileSlug,
          readingTime: data.readingTime || stats.text,
          coverImage: data.coverImage,
          author: data.author || 'Anonymous',
          published: data.published !== false,
          content,
          rawContent: fileContent,
        };
      }
    }
  }

  return null;
}

/**
 * Get previous and next blog posts for navigation
 */
export function getAdjacentBlogs(currentSlug: string): {
  previous: BlogPost | null;
  next: BlogPost | null;
} {
  // Import dynamically to avoid circular dependency
  const { getAllBlogs } = require('./getAllBlogs');
  const blogs: BlogPost[] = getAllBlogs();
  
  const currentIndex = blogs.findIndex((blog) => blog.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null,
    next: currentIndex > 0 ? blogs[currentIndex - 1] : null,
  };
}

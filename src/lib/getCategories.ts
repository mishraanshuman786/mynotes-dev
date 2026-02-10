import fs from 'fs';
import path from 'path';
import { Category } from '@/types/blog';
import { getAllBlogs } from './getAllBlogs';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blogs');

// Prettier category names mapping
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  javascript: 'JavaScript',
  react: 'React',
  nextjs: 'Next.js',
  backend: 'Backend',
  'ai-ml': 'AI / ML',
  notes: 'Notes & Learnings',
  typescript: 'TypeScript',
  css: 'CSS',
  database: 'Database',
  devops: 'DevOps',
};

/**
 * Get all categories with blog counts
 */
export function getCategories(): Category[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const blogs = getAllBlogs();
  const categoryCount = new Map<string, number>();

  // Count blogs per category
  blogs.forEach((blog) => {
    const category = blog.category.toLowerCase();
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
  });

  // Also add empty categories from directory structure
  const directories = fs.readdirSync(CONTENT_DIR).filter((dir) => {
    const fullPath = path.join(CONTENT_DIR, dir);
    return fs.statSync(fullPath).isDirectory();
  });

  directories.forEach((dir) => {
    if (!categoryCount.has(dir)) {
      categoryCount.set(dir, 0);
    }
  });

  // Convert to Category array
  const categories: Category[] = [];
  
  categoryCount.forEach((count, slug) => {
    categories.push({
      name: CATEGORY_DISPLAY_NAMES[slug] || formatCategoryName(slug),
      slug,
      count,
    });
  });

  // Sort by count (descending) then by name
  return categories.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get a single category by slug
 */
export function getCategoryBySlug(slug: string): Category | null {
  const categories = getCategories();
  return categories.find((cat) => cat.slug === slug) || null;
}

/**
 * Format category slug to display name
 */
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get category display name from slug
 */
export function getCategoryDisplayName(slug: string): string {
  return CATEGORY_DISPLAY_NAMES[slug] || formatCategoryName(slug);
}

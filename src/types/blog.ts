// Blog post metadata from front-matter
// export interface BlogFrontMatter {
//   title: string;
//   description: string;
//   date: string;
//   category: string;
//   tags: string[];
//   slug: string;
//   readingTime?: string;
//   coverImage?: string;
//   author?: string;
//   published?: boolean;
// }

// Full blog post including content
// export interface BlogPost extends BlogFrontMatter {
//   content: string;
//   rawContent: string;
// }

// Type for blog as returned by Supabase (with categories as array from join)
export interface BlogPostRaw {
  id: string;
  title: string;
  slug: string;
  content_html: string;
  created_at: string;
  tags: string[];
  categories: {
    id: string;
    name: string;
    slug: string;
  }[] | null;
}

// Type for blog after transforming categories array to single object
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content_html: string;
  created_at: string;
  tags: string[];
  categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// Category with count
export interface Category {
  name: string;
  slug: string;
  count: number;
}

// Table of contents item
export interface TocItem {
  id: string;
  title: string;
  level: number;
}

// Search result
export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  matchedContent?: string;
}

// Blog post metadata from front-matter
export interface BlogFrontMatter {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  readingTime?: string;
  coverImage?: string;
  author?: string;
  published?: boolean;
}

// Full blog post including content
export interface BlogPost extends BlogFrontMatter {
  content: string;
  rawContent: string;
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

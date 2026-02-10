import { Suspense } from 'react';
import { getAllBlogs, getAllTags } from '@/lib/getAllBlogs';
import { getCategories } from '@/lib/getCategories';
import { BlogCard } from '@/components/BlogCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { SearchBar } from '@/components/SearchBar';

interface BlogsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
  }>;
}

export const metadata = {
  title: 'All Blogs',
  description: 'Browse all blog posts covering JavaScript, React, Next.js, and more.',
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const { q, category, tag } = params;
  
  let blogs = getAllBlogs();
  const categories = getCategories();
  const allTags = getAllTags();

  // Filter by search query
  if (q) {
    const query = q.toLowerCase();
    blogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        blog.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // Filter by category
  if (category) {
    blogs = blogs.filter((blog) => blog.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by tag
  if (tag) {
    blogs = blogs.filter((blog) =>
      blog.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {category ? (
            <>Browsing: <span className="text-indigo-600 dark:text-indigo-400 capitalize">{category}</span></>
          ) : tag ? (
            <>Tagged: <span className="text-indigo-600 dark:text-indigo-400">#{tag}</span></>
          ) : q ? (
            <>Search: <span className="text-indigo-600 dark:text-indigo-400">&quot;{q}&quot;</span></>
          ) : (
            'All Blogs'
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} found
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-1">
          <Suspense fallback={<div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />}>
            <SearchBar placeholder="Search blogs by title, content, or tags..." />
          </Suspense>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blog Grid */}
        <div className="flex-1">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No blogs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {q || category || tag
                  ? 'Try adjusting your search or filters'
                  : 'Start writing your first blog post!'}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <CategoryBadge
                    key={cat.slug}
                    category={cat.slug}
                    count={cat.count}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tagName) => (
                    <a
                      key={tagName}
                      href={`/blogs?tag=${encodeURIComponent(tagName)}`}
                      className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
                        tag === tagName
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      #{tagName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getAllBlogs } from "@/lib/getAllBlogs";
import { getCategories } from "@/lib/getCategories";
import { BlogCard } from "@/components/BlogCard";
import { CategoryBadge } from "@/components/CategoryBadge";

export default function HomePage() {
  const blogs = getAllBlogs();
  const categories = getCategories();
  const featuredBlogs = blogs.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Personal Learning Journal
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Welcome to My{" "}
          <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Learning Blog
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Documenting my journey through coding, technology, and beyond. Sharing
          knowledge, notes, and experiments along the way.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Browse All Blogs
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            href="/blogs/category/notes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View My Notes
          </Link>
          <Link
            href="/blogs/write"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all duration-200 hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
            Write New Blog
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Browse by Category
          </h2>
          <Link
            href="/blogs"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blogs/category/${category.slug}`}
                className="group p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="text-2xl mb-2">
                  {getCategoryEmoji(category.slug)}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} {category.count === 1 ? "post" : "posts"}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No categories yet. Start writing your first blog!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Latest Posts
          </h2>
          <Link
            href="/blogs"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {featuredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog, index) => (
              <BlogCard key={blog.slug} blog={blog} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Your blog journey starts here. Create your first post!
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Add{" "}
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                .mdx
              </code>{" "}
              files to{" "}
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                src/content/blogs/
              </code>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Helper function to get emoji for category
function getCategoryEmoji(slug: string): string {
  const emojis: Record<string, string> = {
    javascript: "🟨",
    react: "⚛️",
    nextjs: "▲",
    typescript: "🔷",
    backend: "🔧",
    "ai-ml": "🤖",
    notes: "📝",
    css: "🎨",
    database: "🗄️",
    devops: "🚀",
  };
  return emojis[slug] || "📁";
}

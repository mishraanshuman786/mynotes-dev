
import { BlogCard } from "@/components/BlogCard";
import { CategoryBadge } from "@/components/CategoryBadge";
import { SearchBar } from "@/components/SearchBar";
import { getBlogs } from "../actions/blog";
import { getBlogCategories } from "../actions/blogCategory";

export default async function BlogsPage() {
  const blogs = await getBlogs();
 
  const categories = await getBlogCategories();

  // Extract unique tags
  const allTags = Array.from(
    new Set(
      blogs?.flatMap((blog: any) => blog.tags ?? []) ?? []
    )
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          All Blogs
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          {blogs?.length ?? 0}{" "}
          {(blogs?.length ?? 0) === 1 ? "post" : "posts"} found
        </p>
      </div>

      <div className="mb-8">
        <SearchBar placeholder="Search blogs..." />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog: any) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No blogs available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Blogs will appear here once created.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Categories Box */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories?.map((cat: any) => (
                  <CategoryBadge
                    key={cat.slug}
                    category={cat.slug}
                  />
                ))}
              </div>
            </div>

            {/* Tags Box */}
            {allTags.length > 0 && (
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tagName) => (
                    <span
                      key={tagName}
                      className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      #{tagName}
                    </span>
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

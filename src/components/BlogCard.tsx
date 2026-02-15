import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { CategoryBadge } from "./CategoryBadge";
import { format } from "date-fns";

interface BlogCardProps {
  blog: BlogPost;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  const formattedDate = !isNaN(new Date(blog.created_at).getTime())
    ? format(new Date(blog.created_at), "MMM d, yyyy")
    : "—";

  return (
    <article
      className={`group relative bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <div className={`p-6 ${featured ? "flex flex-col justify-center" : ""}`}>
        
        {/* Category */}
        <div className="flex items-center gap-3 mb-3">
          {blog.categories && (
            <CategoryBadge category={blog.categories.name} />
          )}
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          <Link href={`/blogs/${blog.slug}`} className="after:absolute after:inset-0">
            {blog.title}
          </Link>
        </h3>

        {/* Description (auto generated from content_html) */}
        <p
          className={`text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {blog.content_html.replace(/<[^>]+>/g, "").slice(0, 120)}...
        </p>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <time dateTime={blog.created_at}>
            {formattedDate}
          </time>

          <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium group-hover:gap-2 transition-all">
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
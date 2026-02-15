import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/server";
import { ShareButtons } from "@/components/ShareButtons";
import { CategoryBadge } from "@/components/CategoryBadge";
import { format } from "date-fns";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* ===============================
   Generate Metadata (SEO)
================================ */
export async function generateMetadata(
  { params }: BlogDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com";

  return {
    title: blog.title,
    description: blog.content_html?.slice(0, 160),
    keywords: blog.tags,
    openGraph: {
      title: blog.title,
      description: blog.content_html?.slice(0, 160),
      type: "article",
      images: [],
      url: `${siteUrl}/blogs/${blog.slug}`,
    },
  };
}

/* ===============================
   Page Component
================================ */
export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;

  /* ===============================
     Fetch Blog
  ================================ */
  const { data: rawBlog, error } = await supabase
    .from("blogs")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error || !rawBlog) {
    notFound();
  }

  // Transform categories array to single object
  const blog = {
    ...rawBlog,
    categories: Array.isArray(rawBlog.categories) && rawBlog.categories.length > 0
      ? rawBlog.categories[0]
      : null
  };

  /* ===============================
     Fetch Previous / Next
  ================================ */
  const { data: adjacent } = await supabase
    .from("blogs")
    .select("slug, title, created_at")
    .order("created_at", { ascending: false });

  const index = adjacent?.findIndex((b) => b.slug === slug) ?? -1;

  const previous =
    index !== -1 && adjacent && index < adjacent.length - 1
      ? adjacent[index + 1]
      : null;

  const next =
    index > 0 && adjacent
      ? adjacent[index - 1]
      : null;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com";
  const blogUrl = `${siteUrl}/blogs/${slug}`;

  /* ===============================
     Render
  ================================ */
  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blogs">Blogs</Link>
        <span>/</span>
        <Link href={`/blogs?category=${blog.categories?.slug}`}>
          {blog.categories?.name}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {blog.categories && (
            <CategoryBadge category={blog.categories.slug} />
          )}
          <time className="text-sm text-gray-500">
            {format(new Date(blog.created_at), "MMMM d, yyyy")}
          </time>
        </div>

        <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
          {blog.title}
        </h1>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <ShareButtons
          title={blog.title}
          url={blogUrl}
          description={blog.content_html?.slice(0, 160)}
        />
      </header>

      {/* Content */}
      <div
        className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
        dangerouslySetInnerHTML={{
          __html: blog.content_html,
        }}
      />

      {/* Previous / Next */}
      <nav className="mt-12 pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previous ? (
            <Link
              href={`/blogs/${previous.slug}`}
              className="p-6 border rounded-xl"
            >
              ← {previous.title}
            </Link>
          ) : (
            <div />
          )}

          {next && (
            <Link
              href={`/blogs/${next.slug}`}
              className="p-6 border rounded-xl text-right"
            >
              {next.title} →
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
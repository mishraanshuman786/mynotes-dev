import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllBlogs } from '@/lib/getAllBlogs';
import { getBlogBySlug, getAdjacentBlogs } from '@/lib/getBlogBySlug';
import { processMarkdown, extractToc } from '@/lib/markdown';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ShareButtons } from '@/components/ShareButtons';
import { CategoryBadge } from '@/components/CategoryBadge';
import { format } from 'date-fns';
import { TableOfContents } from '@/components/TableOfContents';



interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blogs
export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com';

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.tags,
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: blog.date,
      authors: [blog.author || 'Anonymous'],
      tags: blog.tags,
      images: blog.coverImage
        ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }]
        : [],
      url: `${siteUrl}/blogs/${blog.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const htmlContent = await processMarkdown(blog.content);
  const toc = extractToc(blog.content);
  const { previous, next } = getAdjacentBlogs(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com';
  const blogUrl = `${siteUrl}/blogs/${slug}`;

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/blogs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Blogs
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link
          href={`/blogs/category/${blog.category.toLowerCase()}`}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {blog.category}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <CategoryBadge category={blog.category} />
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {blog.readingTime}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
          <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={blog.date}>
            {format(new Date(blog.date), 'MMMM d, yyyy')}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
          {blog.description}
        </p>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Share buttons */}
        <ShareButtons title={blog.title} url={blogUrl} description={blog.description} />
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="mb-12 rounded-2xl overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Content with TOC */}
      <div className="flex gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <MarkdownRenderer content={htmlContent} />
        </div>

        {/* Table of Contents (Desktop) */}
        {toc.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <TableOfContents items={toc} />
          </aside>
        )}
      </div>

      {/* Author and Share */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {blog.author?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {blog.author || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published on {format(new Date(blog.date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <ShareButtons title={blog.title} url={blogUrl} description={blog.description} />
        </div>
      </div>

      {/* Previous / Next Navigation */}
      <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previous ? (
            <Link
              href={`/blogs/${previous.slug}`}
              className="group p-6 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Post
              </span>
              <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {previous.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/blogs/${next.slug}`}
              className="group p-6 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all text-right"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1 mb-2">
                Next Post
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                {next.title}
              </p>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}

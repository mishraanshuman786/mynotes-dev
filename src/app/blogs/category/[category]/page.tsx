import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/server';
import { BlogCard } from '@/components/BlogCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/* ===============================
   Generate Static Params
================================ */
export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');
  
  return categories?.map((category) => ({
    category: category.slug,
  })) || [];
}

/* ===============================
   Generate Metadata (SEO)
================================ */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  const { data: categoryInfo } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', category)
    .single();

  if (!categoryInfo) {
    return {
      title: 'Category Not Found',
    };
  }

  // Count blogs in this category
  const { count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryInfo.id)
    .eq('status', 'published');

  return {
    title: `${categoryInfo.name} Blogs`,
    description: `Browse all blog posts about ${categoryInfo.name}. ${count || 0} posts available.`,
    openGraph: {
      title: `${categoryInfo.name} Blogs | My Blog`,
      description: `Browse all blog posts about ${categoryInfo.name}. ${count || 0} posts available.`,
    },
  };
}

/* ===============================
   Page Component
================================ */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  /* ===============================
     Fetch Category Info
  ================================ */
  const { data: categoryInfo } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', category)
    .single();

  if (!categoryInfo) {
    notFound();
  }

  /* ===============================
     Fetch Blogs in Category
  ================================ */
  const { data: rawBlogs } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      slug,
      content_html,
      tags,
      created_at,
      category_id,
      categories!inner (
        id,
        name,
        slug
      )
    `)
    .eq('category_id', categoryInfo.id)
    .order('created_at', { ascending: false });

  // Transform categories array to single object
  const blogs = rawBlogs?.map(blog => ({
    ...blog,
    categories: Array.isArray(blog.categories) && blog.categories.length > 0 
      ? blog.categories[0] 
      : null
  }));

  /* ===============================
     Fetch All Categories for Sidebar
  ================================ */
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <span className="text-gray-900 dark:text-white font-medium">{categoryInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <CategoryBadge category={category} size="lg" clickable={false} />
          <span className="text-gray-500 dark:text-gray-400">
            {blogs?.length || 0} {(blogs?.length || 0) === 1 ? 'post' : 'posts'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {categoryInfo.name} Blogs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          All posts related to {categoryInfo.name}. Explore tutorials, guides, and insights.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blog Grid */}
        <div className="flex-1">
          {blogs && blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts in this category yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Check back later or explore other categories.
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Browse All Blogs
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Other Categories
            </h3>
            <div className="flex flex-col gap-2">
              {allCategories
                ?.filter((cat) => cat.slug !== category)
                .map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blogs/category/${cat.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                )) || []}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

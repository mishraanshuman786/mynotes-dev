import Link from 'next/link';

// Category color mapping for visual distinction
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  javascript: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-700',
  },
  react: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-700',
  },
  nextjs: {
    bg: 'bg-gray-100 dark:bg-gray-700/50',
    text: 'text-gray-700 dark:text-gray-200',
    border: 'border-gray-300 dark:border-gray-600',
  },
  typescript: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-700',
  },
  backend: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-700',
  },
  'ai-ml': {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-700',
  },
  notes: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-700',
  },
  css: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-700',
  },
  database: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-700',
  },
  devops: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-700',
  },
};

// Default colors for unknown categories
const defaultColors = {
  bg: 'bg-gray-100 dark:bg-gray-700/50',
  text: 'text-gray-700 dark:text-gray-300',
  border: 'border-gray-200 dark:border-gray-600',
};

interface CategoryBadgeProps {
  category: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export function CategoryBadge({ 
  category, 
  count, 
  size = 'sm', 
  clickable = true 
}: CategoryBadgeProps) {
  const colors = categoryColors[category.toLowerCase()] || defaultColors;
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const className = `inline-flex items-center gap-1.5 rounded-full font-medium border transition-all duration-200 ${
    colors.bg
  } ${colors.text} ${colors.border} ${sizeClasses[size]} ${
    clickable ? 'hover:scale-105 hover:shadow-sm cursor-pointer' : ''
  }`;

  const content = (
    <>
      <span className="capitalize">{formatCategoryName(category)}</span>
      {count !== undefined && (
        <span className={`${colors.bg} ${colors.text} rounded-full px-1.5 py-0.5 text-xs font-bold`}>
          {count}
        </span>
      )}
    </>
  );

  if (clickable) {
    return (
      <Link href={`/blogs/category/${category.toLowerCase()}`} className={className}>
        {content}
      </Link>
    );
  }

  return <span className={className}>{content}</span>;
}

// Format category slug to display name
function formatCategoryName(slug: string): string {
  const displayNames: Record<string, string> = {
    javascript: 'JavaScript',
    react: 'React',
    nextjs: 'Next.js',
    typescript: 'TypeScript',
    backend: 'Backend',
    'ai-ml': 'AI / ML',
    notes: 'Notes',
    css: 'CSS',
    database: 'Database',
    devops: 'DevOps',
  };
  
  return displayNames[slug.toLowerCase()] || 
    slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

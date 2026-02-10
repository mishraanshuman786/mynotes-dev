import './markdown.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article 
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-transparent prose-pre:p-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

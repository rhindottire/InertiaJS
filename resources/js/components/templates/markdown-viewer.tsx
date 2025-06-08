import { cn } from '@/lib/utils';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import InteractiveCodeBlock from './interactive-code-block';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div className={cn('lesson-content prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Interactive code blocks
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            // Only render interactive code block for non-inline code with a language
            if (!inline && match) {
              return <InteractiveCodeBlock code={codeContent} language={match[1]} />;
            }

            // For inline code
            return (
              <code className={cn('bg-muted rounded px-1.5 py-0.5 text-sm', className)} {...props}>
                {children}
              </code>
            );
          },
          // Links open in new tab
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...props} />,
          // Headings with proper spacing for lessons
          h1: ({ node, ...props }) => <h1 className="mt-6 mb-4 text-2xl font-bold" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-5 mb-3 text-xl font-bold" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-lg font-bold" {...props} />,
          // Lists with proper indentation
          ul: ({ node, ...props }) => <ul className="my-4 list-disc space-y-2 pl-6" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-4 list-decimal space-y-2 pl-6" {...props} />,
          // Blockquotes for important notes
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-primary/30 bg-muted/20 my-4 rounded-r border-l-4 py-2 pl-4 italic" {...props} />
          ),
          // Tables with proper styling
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table className="divide-border min-w-full divide-y" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-muted/50" {...props} />,
          th: ({ node, ...props }) => <th className="px-3 py-2 text-left text-xs font-medium tracking-wider uppercase" {...props} />,
          td: ({ node, ...props }) => <td className="px-3 py-2" {...props} />,
          // Paragraphs with proper line height for readability
          p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
          // Images with proper sizing
          img: ({ node, ...props }) => <img className="mx-auto my-4 h-auto max-w-full rounded-md" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
    children: string;
}

export function Markdown({ children }: MarkdownProps) {
    return (
        <article className="mx-auto prose prose-stone">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    pre({ children }) {
                        return <pre className="not-prose rounded-xl overflow-hidden">{children}</pre>;
                    },
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter
                                customStyle={{ margin: 0 }}
                                language={match[1]}
                                PreTag={'div'}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {children}
            </ReactMarkdown>
        </article>
    );
}

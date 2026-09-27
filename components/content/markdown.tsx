import { ExternalLink } from "lucide-react";
import Markdown, { type Components } from "react-markdown";

// Styles for the Markdown in content/ (headings, paragraphs, lists, bold, links).
// Raw HTML in the Markdown is not rendered (react-markdown default).
const components: Components = {
  h2: ({ children }) => <h2 className="mt-8 text-lg font-semibold first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mt-3">{children}</p>,
  ul: ({ children }) => <ul className="mt-3 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-3 list-decimal space-y-1 pl-5">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className="font-medium underline underline-offset-4"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
        {external && <ExternalLink aria-hidden className="ml-0.5 inline size-3.5" />}
      </a>
    );
  },
};

export function MarkdownText({ children }: { children: string }) {
  return (
    <div className="leading-relaxed">
      <Markdown components={components}>{children}</Markdown>
    </div>
  );
}

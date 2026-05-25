import { MDXRemote } from "next-mdx-remote/rsc";
import { HTMLAttributes, ImgHTMLAttributes } from "react";

const components = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-serif text-3xl md:text-4xl lg:text-[48px] font-normal leading-[1.1] tracking-tight mt-12 mb-6 text-ink-dark transition-colors duration-500" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-serif text-2xl md:text-3xl font-normal leading-[1.3] tracking-tight mt-10 mb-4 text-ink-dark transition-colors duration-500" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif text-xl md:text-2xl font-medium leading-[1.4] mt-8 mb-4 text-ink transition-colors duration-500" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="font-serif text-lg md:text-xl leading-[1.8] mb-6 text-ink/90 transition-colors duration-500" {...props} />
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent transition-colors duration-500" {...props} />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-accent pl-6 italic font-serif text-xl md:text-2xl my-10 text-ink/80 leading-[1.6] transition-colors duration-500" {...props} />
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg border border-stone/30 w-full h-auto my-10 transition-colors duration-500" {...props} alt={props.alt || ""} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 space-y-3 mb-6 font-serif text-lg md:text-xl text-ink/90 leading-[1.8] transition-colors duration-500" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 space-y-3 mb-6 font-serif text-lg md:text-xl text-ink/90 leading-[1.8] transition-colors duration-500" {...props} />
  ),
  hr: () => <hr className="my-12 border-stone/50 transition-colors duration-500" />,
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code className="font-sans text-[0.85em] bg-surface/80 px-1.5 py-0.5 rounded text-ink/90 transition-colors duration-500" {...props} />
  ),
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <pre className="font-sans text-sm bg-surface/50 p-6 rounded-lg overflow-x-auto my-8 border border-stone/30 transition-colors duration-500" {...props} />
  ),
};

interface MDXRendererProps {
  source: string;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <article className="prose-none max-w-[65ch] mx-auto w-full">
      <MDXRemote source={source} components={components} />
    </article>
  );
}

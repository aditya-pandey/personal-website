import { MDXRemote } from "next-mdx-remote/rsc";
import { HTMLAttributes, ImgHTMLAttributes } from "react";

const components = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-serif text-3xl md:text-4xl lg:text-[48px] font-normal leading-[1.1] tracking-tight mt-12 mb-6" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-serif text-2xl md:text-3xl font-normal leading-[1.3] mt-10 mb-4" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif text-xl md:text-2xl font-medium leading-[1.4] mt-8 mb-4" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="font-sans text-base md:text-lg leading-[1.7] mb-6 text-ink/90" {...props} />
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent transition-colors" {...props} />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-accent pl-6 italic font-serif text-xl my-8 text-ink-dark/80" {...props} />
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg border border-stone/30 w-full h-auto my-8" {...props} alt={props.alt || ""} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 space-y-2 mb-6 font-sans text-base md:text-lg text-ink/90" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 space-y-2 mb-6 font-sans text-base md:text-lg text-ink/90" {...props} />
  ),
  hr: () => <hr className="my-12 border-stone/50" />,
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

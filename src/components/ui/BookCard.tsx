"use client";

import { useState } from "react";

interface BookCardProps {
  href: string;
  src: string;
  fallbackSrc?: string;
  alt?: string;
  title: string;
  author: string;
  linkText: string;
}

export function BookCard({ href, src, fallbackSrc, alt, title, author, linkText }: BookCardProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <a className="book-card select-none" href={href} target="_blank" rel="noopener noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt || title}
        onError={() => {
          if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          }
        }}
      />
      <div className="book-card-body">
        <div className="book-card-title">{title}</div>
        <div className="book-card-author">{author}</div>
        <span className="book-card-link">{linkText}</span>
      </div>
    </a>
  );
}

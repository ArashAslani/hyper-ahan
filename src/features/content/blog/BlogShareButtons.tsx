"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faComment, faLink, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

type BlogShareButtonsProps = {
  title: string;
};

export function BlogShareButtons({ title }: BlogShareButtonsProps) {
  const [url] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable in this browser/context; share links still work.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "تلگرام",
      icon: faPaperPlane,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "واتساپ",
      icon: faComment,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-text-muted">اشتراک‌گذاری:</span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`اشتراک‌گذاری در ${link.label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-accent hover:text-accent"
        >
          <FontAwesomeIcon icon={link.icon} />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="کپی لینک مقاله"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-accent hover:text-accent"
      >
        <FontAwesomeIcon icon={copied ? faCheck : faLink} />
      </button>
    </div>
  );
}

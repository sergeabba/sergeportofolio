"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TypeWriterProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export default function TypeWriter({
  texts,
  typeSpeed = 70,
  deleteSpeed = 35,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const current = texts[textIndex];

    if (!isDeleting) {
      if (charIndex < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, typeSpeed);
      } else {
        /* Pause avant suppression */
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else {
      if (charIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      }
    }

    return clear;
  }, [charIndex, isDeleting, textIndex, texts, typeSpeed, deleteSpeed, pauseDuration, clear]);

  return (
    <span aria-label={texts[textIndex]} role="text">
      <span className="text-[var(--color-gold)]">{displayed}</span>
      <span
        className="text-[var(--color-gold)] opacity-70 animate-pulse-slow"
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}

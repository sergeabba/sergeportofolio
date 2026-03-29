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
  typeSpeed = 65,
  deleteSpeed = 32,
  pauseDuration = 2200,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <span style={{ color: "var(--color-gold)" }}>{displayed}</span>
      <span
        style={{ color: "var(--color-gold)", opacity: 0.6 }}
        className="animate-pulse-dot"
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
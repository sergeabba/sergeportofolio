"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const safeTexts = useMemo(() => (texts.length > 0 ? texts : [""]), [texts]);
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = safeTexts[textIndex] ?? "";

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isDeleting) {
      if (charIndex < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((value) => value + 1);
        }, typeSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else if (charIndex > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((value) => value - 1);
      }, deleteSpeed);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((value) => (value + 1) % safeTexts.length);
      }, 0);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [charIndex, deleteSpeed, isDeleting, pauseDuration, safeTexts, textIndex, typeSpeed]);

  return (
    <span aria-label={safeTexts[textIndex]} role="text">
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

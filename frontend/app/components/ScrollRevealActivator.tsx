"use client";

import { useEffect } from "react";

export function ScrollRevealActivator() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => activateScrollReveal());
      return;
    }

    setTimeout(() => activateScrollReveal(), 1);
  }, []);

  return null;
}

function activateScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>(".scroll-reveal");

  if (!elements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal");
        observerInstance.unobserve(entry.target);
      });
    },
    { rootMargin: "80px 0px", threshold: 0.12 },
  );

  elements.forEach((element) => observer.observe(element));
}

'use client';
import { useEffect } from 'react';

export default function SiteInteractions() {
  useEffect(() => {
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const sections = Array.from(document.querySelectorAll('.sheet[id]'));

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tabs.forEach((t) =>
              t.classList.toggle('active', t.getAttribute('href') === '#' + id)
            );
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => spyObserver.observe(s));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

    return () => {
      spyObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return null;
}

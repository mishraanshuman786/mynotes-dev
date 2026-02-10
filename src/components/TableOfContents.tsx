"use client"

import { TocItem } from '@/types/blog';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0,
      }
    );

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="sticky top-24">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
        Table of Contents
      </h4>
      <ul className="space-y-2 text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indent = item.level === 2 ? '' : item.level === 3 ? 'pl-4' : 'pl-8';
          
          return (
            <li key={item.id} className={indent}>
              <button
                onClick={() => handleClick(item.id)}
                className={`block text-left w-full py-1 border-l-2 pl-3 transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

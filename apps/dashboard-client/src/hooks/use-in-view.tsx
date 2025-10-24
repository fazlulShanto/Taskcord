import { useEffect, useRef, useState } from 'react';

export function useInView(options: { triggerOnce?: boolean; threshold?: number } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.triggerOnce) {
            observer.disconnect();
          }
        } else if (!options.triggerOnce) {
          setInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options.triggerOnce, options.threshold]);

  return [ref, inView] as const;
}

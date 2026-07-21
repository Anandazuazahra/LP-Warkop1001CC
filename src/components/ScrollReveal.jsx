import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
  children,
  variant = 'up', // 'up' | 'fade' | 'slide-left' | 'slide-right'
  delay = 0,
  stagger = false,
  threshold = 0.12,
  className = '',
  style = {},
  once = true
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold, once]);

  const getVariantClass = () => {
    switch (variant) {
      case 'fade':
        return 'reveal-fade';
      case 'slide-left':
        return 'reveal-slide-left';
      case 'slide-right':
        return 'reveal-slide-right';
      case 'up':
      default:
        return 'reveal-init';
    }
  };

  const combinedClasses = [
    getVariantClass(),
    isVisible ? 'reveal-visible' : '',
    stagger ? 'stagger-parent' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const combinedStyles = {
    ...style,
    transitionDelay: delay ? `${delay}ms` : undefined
  };

  return (
    <div ref={ref} className={combinedClasses} style={combinedStyles}>
      {children}
    </div>
  );
}

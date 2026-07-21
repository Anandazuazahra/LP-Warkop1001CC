import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({
  end,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1500,
  label = '',
  sublabel = '',
  icon: Icon
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(end);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const startVal = 0;

          const easeOutQuad = (t) => t * (2 - t);

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);
            const currentVal = startVal + (end - startVal) * easedProgress;

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [end, duration, hasAnimated]);

  const formattedNumber = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);

  return (
    <div
      ref={ref}
      className="card-hover"
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '28px 24px',
        border: '1px solid var(--border-card)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(201, 110, 40, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            color: 'var(--accent-copper)'
          }}
        >
          <Icon size={24} />
        </div>
      )}

      <div
        style={{
          fontSize: '2.4rem',
          fontFamily: 'var(--font-serif)',
          fontWeight: '700',
          color: 'var(--accent-copper)',
          lineHeight: '1.1',
          marginBottom: '6px'
        }}
      >
        {prefix}
        {formattedNumber}
        {suffix}
      </div>

      {label && (
        <div
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--text-headline)',
            marginBottom: sublabel ? '2px' : '0'
          }}
        >
          {label}
        </div>
      )}

      {sublabel && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

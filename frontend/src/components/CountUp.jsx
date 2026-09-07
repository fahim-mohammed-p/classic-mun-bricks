import React, { useState, useEffect, useRef } from 'react';

/**
 * CountUp Component
 * Smoothly animates numerical values upward using requestAnimationFrame
 * when entering the viewport once.
 * 
 * Supports strings like "2.5K+", "1.5K+", "1K+", "20+", and numbers like 20.
 * Always renders the exact target string upon completion with zero layout shift.
 */
const CountUp = ({ value, duration = 1400, className = '' }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(String(value));
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    // Parse target number and format type
    const strVal = String(value).trim();
    let targetNum = 0;
    let formatType = 'plain';

    if (strVal.endsWith('K+')) {
      const num = parseFloat(strVal.replace('K+', ''));
      targetNum = (isNaN(num) ? 0 : num) * 1000;
      formatType = 'K+';
    } else if (strVal.endsWith('+')) {
      const num = parseFloat(strVal.replace('+', ''));
      targetNum = isNaN(num) ? 0 : num;
      formatType = '+';
    } else {
      const num = parseFloat(strVal);
      targetNum = isNaN(num) ? 0 : num;
      formatType = 'plain';
    }

    const formatCurrent = (current, isFinished) => {
      if (isFinished) return strVal;

      if (formatType === 'K+') {
        if (current < 950) {
          return `${Math.round(current)}`;
        }
        const kVal = (current / 1000).toFixed(1);
        return `${kVal.replace(/\.0$/, '')}K`;
      }

      if (formatType === '+') {
        return `${Math.round(current)}+`;
      }

      return `${Math.round(current)}`;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          let startTimestamp = null;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(1, elapsed / duration);

            // Cubic ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentNum = targetNum * easeOut;

            if (progress < 1) {
              setDisplayValue(formatCurrent(currentNum, false));
              requestAnimationFrame(step);
            } else {
              setDisplayValue(strVal);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
};

export default CountUp;

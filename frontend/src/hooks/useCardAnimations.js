import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useCardAnimations Hook
 * 
 * Viewport-aware IntersectionObserver for mobile-first continuous card micro-animations.
 * Automatically discovers all cards matching animation selectors across routes and dynamic content.
 * 
 * Key Performance Features:
 * - Automatically pauses animations when cards are off-screen to conserve CPU, GPU, and mobile battery.
 * - Activates smoothly via .is-in-view class.
 * - Uses a MutationObserver to instantly observe asynchronously mounted cards (e.g. blog posts).
 * - Honors prefers-reduced-motion.
 * - Zero external dependencies.
 */
export const useCardAnimations = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Respect user's prefers-reduced-motion accessibility setting
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback for environments without IntersectionObserver: add .is-in-view to all cards
      document.querySelectorAll(
        '.feature-card, .manufacturing-feature-card, .product-showcase-card, .process-media-wrapper, .region-card-panel, .about-location-info-box, .blog-card, .quick-action-card, .contact-info-card, .location-card, .hero-stat-display'
      ).forEach((el) => el.classList.add('is-in-view'));
      return;
    }

    const CARD_SELECTORS = [
      '.feature-card',
      '.manufacturing-feature-card',
      '.product-showcase-card',
      '.process-media-wrapper',
      '.region-card-panel',
      '.about-location-info-box',
      '.blog-card',
      '.quick-action-card',
      '.contact-info-card',
      '.location-card',
      '.hero-stat-display',
    ].join(', ');

    // Single lightweight IntersectionObserver instance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          } else {
            entry.target.classList.remove('is-in-view');
          }
        });
      },
      {
        root: null,
        rootMargin: '100px 0px 100px 0px', // Pre-activate slightly before entering viewport for seamless mobile scrolling
        threshold: 0.05,
      }
    );

    const observedSet = new WeakSet();

    const observeMatchingElements = () => {
      const elements = document.querySelectorAll(CARD_SELECTORS);
      elements.forEach((el) => {
        if (!observedSet.has(el)) {
          observedSet.add(el);
          observer.observe(el);
        }
      });
    };

    // Initial query on mount / route change
    observeMatchingElements();

    // Query again after short intervals to observe lazy/async loaded components
    const timer1 = setTimeout(observeMatchingElements, 250);
    const timer2 = setTimeout(observeMatchingElements, 800);

    // MutationObserver to automatically detect dynamically added elements (e.g. blog posts after API fetch)
    const mutationObserver = new MutationObserver(() => {
      observeMatchingElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
};

export default useCardAnimations;

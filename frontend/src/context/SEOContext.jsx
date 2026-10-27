import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const SEOContext = createContext(null);

export const SEOProvider = ({ children }) => {
  const [bundle, setBundle] = useState({
    pages: {},
    images: {},
    settings: {},
    redirects: [],
  });
  const [loaded, setLoaded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 1. Fetch complete SEO bundle on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchBundle = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SEO_BUNDLE);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setBundle(data);
            setLoaded(true);
          }
        }
      } catch (err) {
        // Safe offline/fallback degradation without breaking UI
        console.debug('SEO bundle fetch note:', err);
      }
    };
    fetchBundle();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Client-side URL Redirect enforcement
  useEffect(() => {
    if (!bundle.redirects || bundle.redirects.length === 0) return;
    const currentPath = location.pathname.replace(/\/+$/, '') || '/';
    const match = bundle.redirects.find((r) => {
      const src = (r.source_path || '').replace(/\/+$/, '') || '/';
      return src === currentPath;
    });

    if (match && match.destination_url) {
      if (match.destination_url.startsWith('http://') || match.destination_url.startsWith('https://')) {
        window.location.replace(match.destination_url);
      } else {
        navigate(match.destination_url, { replace: true });
      }
    }
  }, [location.pathname, bundle.redirects, navigate]);

  // Current page configuration resolution
  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const currentPageSEO = bundle.pages?.[currentPath] || bundle.pages?.[location.pathname] || null;

  /**
   * Dynamic heading lookup with fallback to original code text.
   * If the SEO team configured a heading in Django Admin, returns that text;
   * otherwise returns the pristine default component heading.
   */
  const getHeading = useCallback(
    (headingKey, fallbackText) => {
      if (currentPageSEO?.headings && headingKey in currentPageSEO.headings) {
        const val = currentPageSEO.headings[headingKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return val;
        }
      }
      if (bundle.headings && headingKey in bundle.headings) {
        const val = bundle.headings[headingKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return val;
        }
      }
      return fallbackText;
    },
    [currentPageSEO, bundle.headings]
  );

  /**
   * Dynamic image alt text lookup with fallback to original asset alt text.
   */
  const getImageAlt = useCallback(
    (imageKey, fallbackAlt) => {
      if (bundle.images && imageKey in bundle.images) {
        const val = bundle.images[imageKey];
        if (val !== undefined && val !== null) {
          return val;
        }
      }
      return fallbackAlt;
    },
    [bundle.images]
  );

  /**
   * Dynamic page-specific SEO supporting content/introduction paragraph.
   */
  const getContent = useCallback(
    (fallbackContent = '') => {
      if (currentPageSEO?.seo_content && currentPageSEO.seo_content.trim()) {
        return currentPageSEO.seo_content;
      }
      return fallbackContent;
    },
    [currentPageSEO]
  );

  const value = useMemo(
    () => ({
      bundle,
      loaded,
      currentPageSEO,
      currentPath,
      getHeading,
      getImageAlt,
      getContent,
      settings: bundle.settings || {},
    }),
    [bundle, loaded, currentPageSEO, currentPath, getHeading, getImageAlt, getContent]
  );

  return <SEOContext.Provider value={value}>{children}</SEOContext.Provider>;
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    return {
      bundle: { pages: {}, images: {}, settings: {}, redirects: [] },
      loaded: false,
      currentPageSEO: null,
      currentPath: '/',
      getHeading: (_, fallback) => fallback,
      getImageAlt: (_, fallback) => fallback,
      getContent: (fallback) => fallback,
      settings: {},
    };
  }
  return context;
};

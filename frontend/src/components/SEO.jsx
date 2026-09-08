import { useEffect } from 'react';

/**
 * Lightweight SPA SEO metadata manager.
 * Updates document.title, meta tags (description, Open Graph), and canonical links
 * dynamically for client-side routing without external dependencies.
 */
const SEO = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = null,
  publishedTime = null,
  author = 'Classic Mun Bricks',
}) => {
  useEffect(() => {
    // 1. Document Title
    const originalTitle = document.title;
    if (title) {
      document.title = title;
    }

    // Helper to safely set/create meta tags
    const setMetaTag = (attrName, attrVal, contentVal) => {
      if (!contentVal) return null;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      let created = false;
      let prevContent = null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
        created = true;
      } else {
        prevContent = el.getAttribute('content');
      }
      el.setAttribute('content', contentVal);
      return { el, created, prevContent };
    };

    // Helper to safely set/create link tags (e.g. canonical)
    const setLinkTag = (rel, hrefVal) => {
      if (!hrefVal) return null;
      let el = document.querySelector(`link[rel="${rel}"]`);
      let created = false;
      let prevHref = null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
        created = true;
      } else {
        prevHref = el.getAttribute('href');
      }
      el.setAttribute('href', hrefVal);
      return { el, created, prevHref };
    };

    const cleanupRecords = [];

    // Description
    if (description) {
      cleanupRecords.push(setMetaTag('name', 'description', description));
      cleanupRecords.push(setMetaTag('property', 'og:description', description));
      cleanupRecords.push(setMetaTag('name', 'twitter:description', description));
    }

    // Title for OG and Twitter
    if (title) {
      cleanupRecords.push(setMetaTag('property', 'og:title', title));
      cleanupRecords.push(setMetaTag('name', 'twitter:title', title));
    }

    // Canonical & OG URL
    if (canonicalUrl) {
      cleanupRecords.push(setLinkTag('canonical', canonicalUrl));
      cleanupRecords.push(setMetaTag('property', 'og:url', canonicalUrl));
    }

    // OG Type
    cleanupRecords.push(setMetaTag('property', 'og:type', ogType));

    // OG Image
    if (ogImage) {
      cleanupRecords.push(setMetaTag('property', 'og:image', ogImage));
      cleanupRecords.push(setMetaTag('name', 'twitter:image', ogImage));
      cleanupRecords.push(setMetaTag('name', 'twitter:card', 'summary_large_image'));
    } else {
      cleanupRecords.push(setMetaTag('name', 'twitter:card', 'summary'));
    }

    // Article specifics
    if (ogType === 'article') {
      if (publishedTime) {
        cleanupRecords.push(setMetaTag('property', 'article:published_time', publishedTime));
      }
      if (author) {
        cleanupRecords.push(setMetaTag('property', 'article:author', author));
      }
    }

    return () => {
      document.title = originalTitle;
      cleanupRecords.forEach((rec) => {
        if (!rec) return;
        if (rec.created && rec.el.parentNode) {
          rec.el.parentNode.removeChild(rec.el);
        } else if (rec.prevContent !== null) {
          rec.el.setAttribute('content', rec.prevContent);
        } else if (rec.prevHref !== null) {
          rec.el.setAttribute('href', rec.prevHref);
        }
      });
    };
  }, [title, description, canonicalUrl, ogType, ogImage, publishedTime, author]);

  return null;
};

export default SEO;

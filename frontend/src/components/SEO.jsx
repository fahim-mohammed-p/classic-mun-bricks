import { useEffect } from 'react';
import { useSEO } from '../context/SEOContext';

/**
 * Production-ready SPA SEO metadata manager.
 * Dynamically updates document.title, meta tags (description, robots, Open Graph, Twitter),
 * canonical links, and Schema.org JSON-LD structured data.
 *
 * Seamlessly integrates with Django Admin SEO settings via SEOContext,
 * while allowing individual pages or components to supply explicit prop overrides.
 */
const SEO = ({
  title,
  description,
  canonicalUrl,
  indexDirective,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  schemaMarkup,
  publishedTime = null,
  author = 'Classic Mun Bricks',
}) => {
  const { currentPageSEO, settings } = useSEO();

  // Resolve values prioritizing dynamic Django Admin PageSEO > explicit fallback props > site settings defaults
  const effectiveTitle =
    currentPageSEO?.meta_title ||
    title ||
    (settings?.site_name
      ? `${settings.site_name}${settings.site_title_suffix || ''}`
      : 'Classic Mun Bricks | Strong Beyond Any Bricks');

  const effectiveDescription =
    currentPageSEO?.meta_description ||
    description ||
    settings?.default_meta_description ||
    '';

  const effectiveCanonical =
    currentPageSEO?.canonical_url ||
    canonicalUrl ||
    (settings?.canonical_base_url ? `${settings.canonical_base_url}/` : '');

  const effectiveRobots =
    currentPageSEO?.index_directive ||
    indexDirective ||
    (settings?.robots_allow_indexing ? 'index, follow' : 'noindex, follow');

  const effectiveOgTitle =
    currentPageSEO?.og_title ||
    ogTitle ||
    effectiveTitle;

  const effectiveOgDescription =
    currentPageSEO?.og_description ||
    ogDescription ||
    effectiveDescription;

  const effectiveOgImage =
    currentPageSEO?.og_image ||
    ogImage ||
    settings?.default_og_image ||
    'https://www.classicmunbricks.com/logo.png';

  const effectiveTwitterCard =
    currentPageSEO?.twitter_card ||
    twitterCard ||
    settings?.default_twitter_card ||
    'summary_large_image';

  const effectiveSchema =
    currentPageSEO?.schema_markup !== undefined && currentPageSEO?.schema_markup !== null
      ? currentPageSEO.schema_markup
      : (schemaMarkup !== undefined ? schemaMarkup : null);

  useEffect(() => {
    const originalTitle = document.title;
    if (effectiveTitle) {
      document.title = effectiveTitle;
    }

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

    const setLinkTag = (rel, hrefVal) => {
      if (!hrefVal) return null;
      let el = document.querySelector(`link[rel="${rel}"]`);
      let created = false;
      let prevHref = null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute(rel, rel);
        document.head.appendChild(el);
        created = true;
      } else {
        prevHref = el.getAttribute('href');
      }
      el.setAttribute('href', hrefVal);
      return { el, created, prevHref };
    };

    const cleanupRecords = [];

    // 1. Meta Description
    if (effectiveDescription) {
      cleanupRecords.push(setMetaTag('name', 'description', effectiveDescription));
      cleanupRecords.push(setMetaTag('property', 'og:description', effectiveOgDescription));
      cleanupRecords.push(setMetaTag('name', 'twitter:description', effectiveOgDescription));
    }

    // 2. Robots Indexing Directive
    if (effectiveRobots) {
      cleanupRecords.push(setMetaTag('name', 'robots', effectiveRobots));
    }

    // 3. Document & Social Titles
    if (effectiveTitle) {
      cleanupRecords.push(setMetaTag('property', 'og:title', effectiveOgTitle));
      cleanupRecords.push(setMetaTag('name', 'twitter:title', effectiveOgTitle));
    }

    // 4. Canonical & OG URL
    if (effectiveCanonical) {
      cleanupRecords.push(setLinkTag('canonical', effectiveCanonical));
      cleanupRecords.push(setMetaTag('property', 'og:url', effectiveCanonical));
      cleanupRecords.push(setMetaTag('name', 'twitter:url', effectiveCanonical));
    }

    // 5. Open Graph Type
    cleanupRecords.push(setMetaTag('property', 'og:type', ogType));

    // 6. Social Images & Twitter Card
    if (effectiveOgImage) {
      cleanupRecords.push(setMetaTag('property', 'og:image', effectiveOgImage));
      cleanupRecords.push(setMetaTag('name', 'twitter:image', effectiveOgImage));
    }
    cleanupRecords.push(setMetaTag('name', 'twitter:card', effectiveTwitterCard));

    // 7. Article specific tags
    if (ogType === 'article') {
      if (publishedTime) {
        cleanupRecords.push(setMetaTag('property', 'article:published_time', publishedTime));
      }
      if (author) {
        cleanupRecords.push(setMetaTag('property', 'article:author', author));
      }
    }

    // 8. Structured Data (JSON-LD)
    let schemaScript = null;
    if (effectiveSchema) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'page-json-ld';
      schemaScript.textContent = JSON.stringify(effectiveSchema);
      document.head.appendChild(schemaScript);
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

      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [
    effectiveTitle,
    effectiveDescription,
    effectiveCanonical,
    effectiveRobots,
    effectiveOgTitle,
    effectiveOgDescription,
    effectiveOgImage,
    effectiveTwitterCard,
    ogType,
    publishedTime,
    author,
    effectiveSchema,
  ]);

  return null;
};

export default SEO;

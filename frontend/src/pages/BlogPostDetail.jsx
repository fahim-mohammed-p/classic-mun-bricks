import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { CONTACT_CONFIG } from '../config/contact';
import SEO from '../components/SEO';
import SafeBlogContent from '../components/SafeBlogContent';
import '../styles/blog.css';

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsNotFound(false);

        const response = await fetch(API_ENDPOINTS.BLOG_POST_DETAIL(slug), {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.status === 404) {
          if (isMounted) {
            setIsNotFound(true);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setPost(data);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load article details. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchPost();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const calculateReadTime = (text) => {
    if (!text) return '2 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${encodeURIComponent(
    `Hello Classic Mun Bricks, I read your article "${post?.title || 'Blog'}" and would like more information.`
  )}`;

  return (
    <main className="blog-page">
      {/* 1. LOADING STATE */}
      {loading && (
        <div className="container py-5">
          <div className="blog-spinner-wrap" aria-live="polite">
            <div className="spinner-border blog-spinner" role="status">
              <span className="visually-hidden">Loading article...</span>
            </div>
            <p className="mt-3 text-muted small">Loading article...</p>
          </div>
        </div>
      )}

      {/* 2. 404 NOT FOUND STATE */}
      {!loading && isNotFound && (
        <div className="container py-5">
          <div className="blog-empty-state">
            <div className="blog-empty-icon-wrap" aria-hidden="true">
              <i className="bi bi-file-earmark-x" />
            </div>
            <h1 className="blog-empty-heading">Article Not Found</h1>
            <p className="blog-empty-text">
              The article you are looking for might have been moved, unpublished, or does not exist.
            </p>
            <Link to="/blog" className="btn btn-dark px-4 py-2" style={{ borderRadius: 'var(--cmb-radius)' }}>
              <i className="bi bi-arrow-left me-2" /> Back to Blog
            </Link>
          </div>
        </div>
      )}

      {/* 3. GENERIC ERROR STATE */}
      {!loading && !isNotFound && error && (
        <div className="container py-5">
          <div className="blog-error-alert" role="alert">
            <i className="bi bi-exclamation-triangle text-danger fs-3 mb-2 d-block" />
            <h5 className="font-heading mb-2">Notice</h5>
            <p className="text-muted mb-3">{error}</p>
            <Link to="/blog" className="btn btn-outline-dark px-4 py-2" style={{ borderRadius: 'var(--cmb-radius)' }}>
              <i className="bi bi-arrow-left me-2" /> Back to Blog
            </Link>
          </div>
        </div>
      )}

      {/* 4. ARTICLE DETAIL VIEW */}
      {!loading && !isNotFound && !error && post && (
        <>
          <SEO
            title={`${post.seo_title || post.title} | Classic Mun Bricks`}
            description={post.meta_description || post.excerpt || post.title}
            canonicalUrl={`https://www.classicmunbricks.com/blog/${post.slug}`}
            ogType="article"
            ogImage={post.featured_image}
            publishedTime={post.published_at}
            author={post.author_name || 'Classic Mun Bricks'}
          />

          <article className="blog-detail-container">
            {/* Breadcrumb Navigation */}
            <nav aria-label="breadcrumb">
              <div className="blog-breadcrumb">
                <Link to="/">Home</Link>
                <span className="blog-breadcrumb-separator">/</span>
                <Link to="/blog">Blog</Link>
                <span className="blog-breadcrumb-separator">/</span>
                <span className="blog-breadcrumb-active" title={post.title}>
                  {post.title}
                </span>
              </div>
            </nav>

            {/* Article Header */}
            <header className="blog-detail-header">
              <h1 className="blog-detail-title">{post.title}</h1>

              <div className="blog-detail-meta">
                {post.published_at && (
                  <span className="blog-detail-meta-item">
                    <i className="bi bi-calendar3 text-terracotta" />
                    {formatDate(post.published_at)}
                  </span>
                )}
                <span className="blog-detail-meta-item">
                  <i className="bi bi-person text-terracotta" />
                  {post.author_name || 'Classic Mun Bricks'}
                </span>
                <span className="blog-detail-meta-item">
                  <i className="bi bi-clock text-terracotta" />
                  {calculateReadTime(post.content)}
                </span>
              </div>

              {post.excerpt && (
                <div className="blog-detail-excerpt-lead">
                  {post.excerpt}
                </div>
              )}
            </header>

            {/* Optional Featured Image */}
            {post.featured_image && (
              <div className="blog-detail-featured-image-wrap">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="blog-detail-featured-image"
                />
              </div>
            )}

            {/* Safe Rendered Content Body */}
            <SafeBlogContent content={post.content} />

            {/* Author Attribution Card */}
            <div className="blog-author-badge">
              <div className="blog-author-avatar" aria-hidden="true">
                <i className="bi bi-building" />
              </div>
              <div>
                <h6 className="mb-1 font-heading" style={{ fontSize: '1.05rem' }}>
                  {post.author_name || 'Classic Mun Bricks'}
                </h6>
                <p className="small text-muted mb-0">
                  Manufacturer of precision hydraulic-pressed interlocking clay bricks for architectural, residential, and commercial projects across South India.
                </p>
              </div>
            </div>

            {/* Back to Blog Action */}
            <div className="py-2">
              <Link to="/blog" className="btn btn-outline-dark px-4 py-2" style={{ borderRadius: 'var(--cmb-radius)' }}>
                <i className="bi bi-arrow-left me-2" /> Back to All Articles
              </Link>
            </div>

            {/* Final Conversion CTA Box */}
            <div className="blog-cta-box">
              <h2 className="blog-cta-title">Planning a Construction Project?</h2>
              <p className="blog-cta-text">
                Speak directly with our technical brick specialists about interlocking masonry, soil compaction, and site delivery across Kerala & Tamil Nadu.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/contact" className="btn btn-warning px-4 py-2 fw-bold text-dark" style={{ borderRadius: 'var(--cmb-radius)' }}>
                  <i className="bi bi-envelope-fill me-2" /> Enquire Online
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light px-4 py-2"
                  style={{ borderRadius: 'var(--cmb-radius)' }}
                >
                  <i className="bi bi-whatsapp me-2 text-success" /> WhatsApp Us
                </a>
              </div>
            </div>
          </article>
        </>
      )}
    </main>
  );
};

export default BlogPostDetail;

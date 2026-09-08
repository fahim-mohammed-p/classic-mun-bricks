import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import SEO from '../components/SEO';
import '../styles/blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.BLOG_POSTS, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          // Display customer-safe generic error message without exposing backend details
          setError('Unable to load articles right now. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <main className="blog-page">
      <SEO
        title="Blog & Construction Insights | Classic Mun Bricks"
        description="Explore practical insights, construction guidance and updates from Classic Mun Bricks."
        canonicalUrl="https://www.classicmunbricks.com/blog"
        ogType="website"
      />

      {/* =================================================================
          01. COMPACT HERO SECTION
          ================================================================= */}
      <section className="blog-hero text-center">
        <div className="blog-hero-overlay" aria-hidden="true" />
        <div className="container position-relative z-1">
          <span className="blog-hero-eyebrow">INSIGHTS & RESOURCES</span>
          <h1 className="blog-hero-title mb-2">Building Knowledge. Sharing Experience.</h1>
          <p className="blog-hero-subtitle">
            Explore practical insights, construction guidance and updates from Classic Mun Bricks.
          </p>
        </div>
      </section>

      {/* =================================================================
          02. MAIN CONTENT AREA (LOADING / ERROR / EMPTY / POSTS)
          ================================================================= */}
      <div className="container py-5">
        {loading && (
          <div className="blog-spinner-wrap" aria-live="polite">
            <div className="spinner-border blog-spinner" role="status">
              <span className="visually-hidden">Loading articles...</span>
            </div>
            <p className="mt-3 text-muted small">Loading insights & resources...</p>
          </div>
        )}

        {!loading && error && (
          <div className="blog-error-alert" role="alert">
            <i className="bi bi-exclamation-triangle text-danger fs-3 mb-2 d-block" />
            <h5 className="font-heading mb-2">Notice</h5>
            <p className="text-muted mb-0">{error}</p>
          </div>
        )}

        {/* EMPTY STATE: Shown when 0 published posts exist */}
        {!loading && !error && posts.length === 0 && (
          <div className="blog-empty-state">
            <div className="blog-empty-icon-wrap" aria-hidden="true">
              <i className="bi bi-journal-bookmark" />
            </div>
            <h2 className="blog-empty-heading">Insights Coming Soon</h2>
            <p className="blog-empty-text">
              Our resource library is being prepared. Check back soon for updates, practical construction insights and useful information from Classic Mun Bricks.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/projects" className="btn btn-dark px-4 py-2" style={{ borderRadius: 'var(--cmb-radius)' }}>
                <i className="bi bi-collection me-2" /> Explore Our Projects
              </Link>
              <Link to="/contact" className="btn btn-outline-dark px-4 py-2" style={{ borderRadius: 'var(--cmb-radius)' }}>
                <i className="bi bi-telephone me-2" /> Contact Us
              </Link>
            </div>
          </div>
        )}

        {/* POSTS GRID: Shown when published posts exist */}
        {!loading && !error && posts.length > 0 && (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.id || post.slug} className="col-lg-4 col-md-6 col-12">
                <Link to={`/blog/${post.slug}`} className="blog-card">
                  {post.featured_image ? (
                    <div className="blog-card-image-wrap">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="blog-card-image"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="blog-card-text-header" aria-hidden="true" />
                  )}

                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      {post.published_at && (
                        <span className="blog-card-meta-item">
                          <i className="bi bi-calendar3" />
                          {formatDate(post.published_at)}
                        </span>
                      )}
                      <span className="blog-card-meta-item ms-auto">
                        <i className="bi bi-person" />
                        {post.author_name || 'Classic Mun Bricks'}
                      </span>
                    </div>

                    <h2 className="blog-card-title">{post.title}</h2>

                    {post.excerpt && (
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                    )}

                    <div className="blog-card-footer">
                      <span className="blog-card-link">
                        Read Article <i className="bi bi-arrow-right" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Blog;

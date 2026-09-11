import React, { useState } from 'react';
import product01ViewA from '../assets/products/product-01-view-a.jpg';
import product01ViewB from '../assets/products/product-01-view-b.jpg';
import product02ViewA from '../assets/products/product-02-view-a.jpg';
import product02ViewB from '../assets/products/product-02-view-b.jpg';

/**
 * ProductShowcase Component
 * 
 * Replaces the previous factory-visit section on the Home page with a clean,
 * product-focused showcase featuring Classic Mun Bricks interlocking laterite products.
 * 
 * Card 1: Product 01 (6-inch interlocking unit, 2 switchable views)
 * Card 2: Product 02 (8-inch interlocking unit, 2 switchable views)
 * Card 3: Product 03 (Clean architectural coming soon placeholder)
 */
const PRODUCTS = [
  {
    id: 'product-01',
    name: 'Product 01',
    subtitle: 'Interlocking Laterite Brick',
    dimensions: '12″ L × 6″ B × 5″ H',
    badge: '6-Inch Unit',
    views: [
      { src: product01ViewA, label: 'View 1: Front Profile' },
      { src: product01ViewB, label: 'View 2: Interlock Ridge Profile' },
    ],
  },
  {
    id: 'product-02',
    name: 'Product 02',
    subtitle: 'Interlocking Laterite Brick',
    dimensions: '12″ L × 8″ B × 5″ H',
    badge: '8-Inch Unit',
    views: [
      { src: product02ViewA, label: 'View 1: Front Profile' },
      { src: product02ViewB, label: 'View 2: Interlock Ridge Profile' },
    ],
  },
  {
    id: 'product-03',
    name: 'Product 03',
    subtitle: 'Future Production Run',
    dimensions: 'Dimensions coming soon',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
];

const ProductCard = ({ product }) => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const hasMultipleViews = product.views && product.views.length > 1;

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMultipleViews) return;
    setActiveViewIndex((prev) => (prev === 0 ? product.views.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMultipleViews) return;
    setActiveViewIndex((prev) => (prev === product.views.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-showcase-card h-100">
      {/* 1. PRODUCT IMAGE VIEWPORT */}
      <div className="product-card-media-wrap">
        {product.isPlaceholder ? (
          <div className="product-placeholder-box" aria-label="Future product placeholder">
            <div className="placeholder-icon-circle">
              <i className="bi bi-box-seam"></i>
            </div>
            <span className="placeholder-status-pill">Next Addition</span>
            <p className="placeholder-hint-text mb-0">Product 03 in development</p>
          </div>
        ) : (
          <>
            {/* Active Image */}
            <img
              src={product.views[activeViewIndex].src}
              alt={`${product.name} - ${product.views[activeViewIndex].label}`}
              className="product-card-img"
              loading="lazy"
            />

            {/* View Switching Arrow Controls */}
            {hasMultipleViews && (
              <div className="product-view-controls">
                <button
                  type="button"
                  className="product-arrow-btn prev-btn"
                  onClick={handlePrev}
                  aria-label={`Previous view of ${product.name}`}
                  title="View previous angle"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <button
                  type="button"
                  className="product-arrow-btn next-btn"
                  onClick={handleNext}
                  aria-label={`Next view of ${product.name}`}
                  title="View next angle"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}

            {/* Bottom View Counter Pill */}
            {hasMultipleViews && (
              <div className="product-view-indicator" aria-live="polite">
                <span>Side {activeViewIndex + 1} of {product.views.length}</span>
                <div className="view-dots" aria-hidden="true">
                  {product.views.map((_, idx) => (
                    <span
                      key={idx}
                      className={`view-dot ${idx === activeViewIndex ? 'is-active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Top Product Tag */}
        <div className="product-card-top-tag">
          <span className={`product-badge ${product.isPlaceholder ? 'badge-placeholder' : ''}`}>
            {product.badge}
          </span>
        </div>
      </div>

      {/* 2. PRODUCT INFO & MEASUREMENTS */}
      <div className="product-card-body">
        <div className="product-card-header">
          <h3 className="product-card-title">{product.name}</h3>
          <span className="product-card-subtitle">{product.subtitle}</span>
        </div>

        {/* Clean Measurement Line */}
        <div className="product-dimension-container">
          <span className="dimension-label">Dimensions:</span>
          <span className={`dimension-value ${product.isPlaceholder ? 'text-muted fst-italic' : ''}`}>
            {!product.isPlaceholder && <i className="bi bi-rulers me-1 text-terracotta"></i>}
            {product.dimensions}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductShowcase = () => {
  return (
    <section 
      className="product-showcase-section position-relative overflow-hidden" 
      id="products"
      aria-labelledby="product-showcase-heading"
    >
      {/* Subtle architectural ambient background glow */}
      <div className="product-showcase-ambient" aria-hidden="true"></div>

      <div className="container position-relative z-1">
        {/* Section Header */}
        <div className="text-center mx-auto mb-4 mb-lg-5" style={{ maxWidth: '640px' }}>
          <span className="badge-tag mb-2">
            Products
          </span>
          <h2 id="product-showcase-heading" className="display-6 fw-bold text-white mt-1 mb-2">
            Our Product Range
          </h2>
          <p className="text-white-50 small mb-0" style={{ fontSize: '0.95rem' }}>
            Precision-engineered compressed laterite bricks shaped for lasting strength and uniform construction.
          </p>
        </div>

        {/* 3 Square Product Cards Grid */}
        <div className="row g-4 justify-content-center">
          {PRODUCTS.map((prod) => (
            <div key={prod.id} className="col-lg-4 col-md-6 col-12">
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

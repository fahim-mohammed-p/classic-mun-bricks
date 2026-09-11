import React, { useState } from 'react';
import product01ViewA from '../assets/products/product-01-view-a.jpg';
import product01ViewB from '../assets/products/product-01-view-b.jpg';
import product02ViewA from '../assets/products/product-02-view-a.jpg';
import product02ViewB from '../assets/products/product-02-view-b.jpg';
import product03ViewA from '../assets/products/product-03-view-a.jpg';

/**
 * ProductShowcase Component
 * 
 * Professional, compact, product-focused showcase for Classic Mun Bricks.
 * 
 * Card 1: Mun Interlock Bricks (6″ unit, 2 switchable views)
 * Card 2: Mun Interlock Bricks (8″ unit, 2 switchable views)
 * Card 3: Mun Brick (Solid laterite unit, single view)
 */
const PRODUCTS = [
  {
    id: 'product-01',
    name: 'Mun Interlock Bricks',
    sizeBadge: '6-Inch Unit',
    dimensions: '12″ L × 6″ B × 5″ H',
    views: [
      { src: product01ViewA, label: 'View 1: Front Profile' },
      { src: product01ViewB, label: 'View 2: Ridge Profile' },
    ],
  },
  {
    id: 'product-02',
    name: 'Mun Interlock Bricks',
    sizeBadge: '8-Inch Unit',
    dimensions: '12″ L × 8″ B × 5″ H',
    views: [
      { src: product02ViewA, label: 'View 1: Front Profile' },
      { src: product02ViewB, label: 'View 2: Ridge Profile' },
    ],
  },
  {
    id: 'product-03',
    name: 'Mun Brick',
    sizeBadge: 'Solid Unit',
    dimensions: '12″ L × 4″ B × 8″ H',
    views: [
      { src: product03ViewA, label: 'View 1: Front Elevation' },
    ],
  },
];

const ProductCard = ({ product }) => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const hasMultipleViews = Boolean(product.views && product.views.length > 1);

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

  const currentView = product.views[activeViewIndex] || product.views[0];

  return (
    <div className="product-showcase-card">
      {/* 1. PRODUCT IMAGE VIEWPORT (Compact Square Area) */}
      <div className="product-card-media-wrap">
        <img
          src={currentView.src}
          alt={`${product.name} - ${currentView.label || 'View'}`}
          className="product-card-img"
          loading="lazy"
        />

        {/* View Switching Arrow Controls (Only shown when multiple views exist) */}
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

        {/* Bottom View Counter Pill (Only shown when multiple views exist) */}
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

        {/* Top Product Size/Type Badge */}
        {product.sizeBadge && (
          <div className="product-card-top-tag">
            <span className="product-badge">
              {product.sizeBadge}
            </span>
          </div>
        )}
      </div>

      {/* 2. PRODUCT INFO & MEASUREMENTS */}
      <div className="product-card-body">
        <div className="product-card-header">
          <h3 className="product-card-title">{product.name}</h3>
        </div>

        {/* Clean, Neatly Aligned Measurement Line */}
        <div className="product-dimension-container">
          <span className="dimension-label">Dimensions</span>
          <span className="dimension-value">
            <i className="bi bi-rulers me-1 text-terracotta"></i>
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
      {/* Subtle ambient background glow */}
      <div className="product-showcase-ambient" aria-hidden="true"></div>

      <div className="container position-relative z-1">
        {/* Section Header - Compact and Simple */}
        <div className="text-center mx-auto mb-3 mb-md-4 product-showcase-header">
          <span className="badge-tag mb-2">
            Products
          </span>
          <h2 id="product-showcase-heading" className="display-6 fw-bold text-white mt-1 mb-1 product-showcase-title">
            Our Product Range
          </h2>
          <p className="text-white-50 small mb-0 product-showcase-desc">
            Precision-engineered compressed laterite bricks for lasting structural stability.
          </p>
        </div>

        {/* 3 Compact Product Cards Grid */}
        <div className="product-cards-grid-wrap mx-auto">
          <div className="row g-3 g-lg-4 justify-content-center">
            {PRODUCTS.map((prod) => (
              <div key={prod.id} className="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

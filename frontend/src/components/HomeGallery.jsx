import React from 'react';
import gallery01 from '../assets/gallery/gallery-01.jpeg';
import gallery02 from '../assets/gallery/gallery-02.jpeg';
import gallery03 from '../assets/gallery/gallery-03.jpeg';
import gallery04 from '../assets/gallery/gallery-04.jpeg';
import gallery05 from '../assets/gallery/gallery-05.jpeg';
import gallery06 from '../assets/gallery/gallery-06.jpeg';
import '../styles/home-gallery.css';

/**
 * HomeGallery Component
 * 
 * Auto-moving, seamless infinite horizontal image marquee showcasing genuine
 * architectural structures built with Classic Mun Bricks.
 */
const GALLERY_ITEMS = [
  { id: 1, src: gallery01, alt: 'Classic Mun Bricks residential exterior showcase 1' },
  { id: 2, src: gallery02, alt: 'Classic Mun Bricks architectural masonry construction 2' },
  { id: 3, src: gallery03, alt: 'Classic Mun Bricks brickwork facade and elevation 3' },
  { id: 4, src: gallery04, alt: 'Classic Mun Bricks modern home building exterior 4' },
  { id: 5, src: gallery05, alt: 'Classic Mun Bricks finished villa construction 5' },
  { id: 6, src: gallery06, alt: 'Classic Mun Bricks architectural brick construction details 6' },
];

const HomeGallery = () => {
  return (
    <section className="home-gallery-section" aria-label="Visual Gallery">
      <div className="container text-center home-gallery-header">
        <span className="home-gallery-eyebrow">GALLERY</span>
        <h2 className="home-gallery-title">Our Gallery</h2>
        <p className="home-gallery-subtitle">
          A glimpse of homes and spaces featuring Classic Mun Bricks.
        </p>
      </div>

      <div className="home-gallery-marquee-wrap">
        <div className="home-gallery-track">
          {/* Group 1: Primary set */}
          <div className="home-gallery-group">
            {GALLERY_ITEMS.map((item) => (
              <div key={`orig-${item.id}`} className="home-gallery-item">
                <div className="home-gallery-card">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="home-gallery-img"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Group 2: Duplicated set for seamless infinite loop (hidden from screen readers) */}
          <div className="home-gallery-group home-gallery-track-clone" aria-hidden="true">
            {GALLERY_ITEMS.map((item) => (
              <div key={`clone-${item.id}`} className="home-gallery-item">
                <div className="home-gallery-card">
                  <img
                    src={item.src}
                    alt=""
                    className="home-gallery-img"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeGallery;

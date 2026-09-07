import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_CONFIG } from '../config/contact';
import CountUp from '../components/CountUp';
import '../styles/about-us.css';

const AboutUs = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const profile = {
    years_experience: 20,
    started_year: 2006,
    total_projects: '2.5K+',
    tamil_nadu_projects: '1K+',
    kerala_projects: '1.5K+',
  };

  useEffect(() => {
    document.title = 'About Us | Classic Mun Bricks';

    // 1. Scroll Progress Bar Listener
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Immediately reveal all sections so document height and content are available instantly
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-revealed'));

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, []);

  return (
    <main className="about-page">
      {/* Scroll Journey Progress Bar */}
      <div 
        className="about-scroll-progress-bar" 
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* ========================================================
          01 — COMPACT HERO (DESKTOP OFFSET CLEARS STICKY NAVBAR)
          ======================================================== */}
      <section className="about-hero text-center">
        <div className="about-hero-overlay"></div>
        <div className="container position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '640px' }}>
            <h1 className="about-hero-title mb-2">
              <CountUp value={profile.years_experience} /> Years of Experience.<br className="d-none d-sm-inline" />
              <span className="text-terracotta"> Built Through Real Projects.</span>
            </h1>
            <p className="lead text-light opacity-90 mb-0" style={{ fontSize: '1rem' }}>
              Since {profile.started_year}, Classic Mun Bricks has served projects across Kerala and Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          02 — EDITORIAL INTRO (2-COLUMN DESKTOP / STACKED MOBILE)
          ======================================================== */}
      <section className="about-intro-section reveal-on-scroll">
        <div className="container">
          <div className="row align-items-center g-4">
            {/* Desktop Left / Mobile Top: Giant 2006 Year Typography */}
            <div className="col-lg-4 text-center text-lg-start">
              <div className="year-display-huge">{profile.started_year}</div>
              <div className="year-sublabel">FOUNDING YEAR</div>
            </div>

            {/* Desktop Right / Mobile Bottom: Short Factual Intro */}
            <div className="col-lg-8 text-center text-lg-start">
              <p className="editorial-intro-text mb-0">
                Classic Mun Bricks has been serving construction projects across Kerala and Tamil Nadu for {profile.years_experience} years. Our experience comes from thousands of completed projects across both states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          03 — TYPOGRAPHY-DRIVEN PROJECT STATISTICS (NO CARDS)
          ======================================================== */}
      <section className="about-stats-section reveal-on-scroll">
        <div className="about-stats-ambient"></div>
        <div className="container position-relative z-1">
          <div className="mx-auto text-center" style={{ maxWidth: '840px' }}>
            {/* Header Badge */}
            <div className="about-eyebrow text-uppercase mb-3">
              <CountUp value={profile.years_experience} /> YEARS OF MANUFACTURING EXPERIENCE
            </div>

            {/* Overarching Primary Footprint Stat (No Bordered Card Box) */}
            <div className="hero-stat-display stagger-item">
              <div className="hero-stat-number">
                <CountUp value={profile.total_projects} />
              </div>
              <div className="hero-stat-label">PROJECTS COMPLETED ACROSS KERALA & TAMIL NADU</div>
            </div>

            <div className="stat-editorial-line"></div>

            {/* Regional Stats Breakdown (Typography Driven) */}
            <div className="row g-4 pt-2">
              <div className="col-6 stagger-item">
                <div className="sub-stat-number tn-accent">
                  <CountUp value={profile.tamil_nadu_projects} />
                </div>
                <div className="sub-stat-label">TAMIL NADU PROJECTS</div>
              </div>

              <div className="col-6 stagger-item">
                <div className="sub-stat-number">
                  <CountUp value={profile.kerala_projects} />
                </div>
                <div className="sub-stat-label">KERALA PROJECTS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          04 — REGIONAL PRESENCE (FLOWING EDITORIAL)
          ======================================================== */}
      <section className="about-experience-section reveal-on-scroll">
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: '640px' }}>
            <span className="about-section-label">REGIONAL FOOTPRINT</span>
            <h2 className="h3 fw-bold mb-3" style={{ fontFamily: 'var(--cmb-font-heading)' }}>
              Serving Kerala & Tamil Nadu
            </h2>
            <p className="text-dark fw-medium mb-1">
              <strong>{profile.tamil_nadu_projects}</strong> projects completed across Tamil Nadu.
            </p>
            <p className="text-dark fw-medium mb-4">
              <strong>{profile.kerala_projects}</strong> projects completed across Kerala.
            </p>
            <Link to="/projects" className="btn-cmb-primary py-2 px-4">
              Explore Projects <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          05 — FACTORY LOCATION
          ======================================================== */}
      <section className="about-location-section reveal-on-scroll">
        <div className="container">
          <div className="row align-items-center g-4">
            {/* Desktop Left / Mobile Top: Address & Directions CTA */}
            <div className="col-lg-5">
              <span className="about-section-label">VISIT US</span>
              <h2 className="h3 fw-bold mb-3" style={{ fontFamily: 'var(--cmb-font-heading)' }}>
                Find Our Factory
              </h2>
              
              <div className="about-location-info-box mb-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="icon-box flex-shrink-0 mb-0" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{CONTACT_CONFIG.companyAddress.name}</h6>
                    <div className="text-muted small">
                      {CONTACT_CONFIG.companyAddress.landmark}<br />
                      {CONTACT_CONFIG.companyAddress.po}<br />
                      {CONTACT_CONFIG.companyAddress.location}, {CONTACT_CONFIG.companyAddress.state} {CONTACT_CONFIG.companyAddress.pincode}
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={CONTACT_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cmb-primary w-100 justify-content-center py-2.5"
              >
                Open in Google Maps <i className="bi bi-box-arrow-up-right ms-1 fs-7"></i>
              </a>
            </div>

            {/* Desktop Right / Mobile Bottom: Google Maps Embed */}
            <div className="col-lg-7">
              <div className="about-map-frame">
                <iframe
                  src={CONTACT_CONFIG.googleMapsEmbedSrc}
                  className="about-map-iframe"
                  title="Classic Mun Bricks Factory Location"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          06 — FINAL CTA
          ======================================================== */}
      <section className="about-final-cta text-center reveal-on-scroll">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: '580px' }}>
            <h2 className="h3 fw-bold text-white mb-3" style={{ fontFamily: 'var(--cmb-font-heading)' }}>
              See Our Work.
            </h2>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/projects" className="btn-cmb-primary px-4">
                Explore Projects <i className="bi bi-arrow-right ms-1"></i>
              </Link>
              <Link to="/visit-us" className="btn-cmb-secondary px-4">
                Visit Our Factory <i className="bi bi-play-fill ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

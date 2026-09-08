import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_CONFIG } from '../config/contact';
import BrandLogo from './BrandLogo';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="text-decoration-none text-white d-inline-block mb-3" aria-label="Classic Mun Bricks Home">
              <BrandLogo variant="footer" />
            </Link>
            <p className="small text-light-50 mb-3" style={{ maxWidth: '340px' }}>

              Manufacturing structural clay bricks for architectural, commercial, and residential construction projects across Kerala and Tamil Nadu.
            </p>
            
            {/* Verified Social Links */}
            <div className="d-flex align-items-center gap-3 pt-2">
              <a 
                href={CONTACT_CONFIG.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Classic Mun Bricks on Instagram"
                className="text-light opacity-75 text-decoration-none fs-5 transition-hover"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a 
                href={CONTACT_CONFIG.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Classic Mun Bricks on Facebook"
                className="text-light opacity-75 text-decoration-none fs-5 transition-hover"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a 
                href={CONTACT_CONFIG.socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Classic Mun Bricks on YouTube"
                className="text-light opacity-75 text-decoration-none fs-5 transition-hover"
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="footer-heading">Navigation</h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/visit-us">Visit Us</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Operational Reach */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="footer-heading">Regional Footprint</h6>
            <ul className="footer-links">
              <li><span className="text-light-50">2.5K+ Total Completed Projects</span></li>
              <li><span className="text-light-50">1K+ Tamil Nadu Projects</span></li>
              <li><span className="text-light-50">1.5K+ Kerala Projects</span></li>
              <li><span className="text-light-50">20 Years Laterite Brick Experience</span></li>
              <li><span className="text-light-50">10 Years Mun Interlock Experience</span></li>
            </ul>
          </div>

          {/* Verified Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Headquarters & Plant</h6>
            <p className="small mb-2 text-light-50">
              <i className="bi bi-geo-alt me-2 text-terracotta"></i>
              {CONTACT_CONFIG.companyAddress.formatted}
            </p>
            <p className="small mb-2 text-light-50">
              <i className="bi bi-telephone me-2 text-terracotta"></i>
              <a href={`tel:${CONTACT_CONFIG.companyPhonePrimaryRaw}`} className="text-light-50 text-decoration-none me-2">
                {CONTACT_CONFIG.companyPhonePrimary}
              </a>
              |
              <a href={`tel:${CONTACT_CONFIG.companyPhoneSecondaryRaw}`} className="text-light-50 text-decoration-none ms-2">
                {CONTACT_CONFIG.companyPhoneSecondary}
              </a>
            </p>
            <p className="small mb-2 text-light-50">
              <i className="bi bi-envelope me-2 text-terracotta"></i>
              <a href={`mailto:${CONTACT_CONFIG.companyEmail}`} className="text-light-50 text-decoration-none">
                {CONTACT_CONFIG.companyEmail}
              </a>
            </p>
            <p className="small mb-0 text-light-50">
              <span className="opacity-75">GSTIN:</span> {CONTACT_CONFIG.companyGst}
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div>
            &copy; {new Date().getFullYear()} Classic Mun Bricks. All rights reserved.
          </div>
          <div className="d-flex gap-4">
            <span className="text-light-50">Privacy Policy</span>
            <span className="text-light-50">Terms of Supply</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

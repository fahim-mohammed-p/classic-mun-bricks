import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CONTACT_CONFIG } from '../config/contact';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  return (
    <>
      {/* DESKTOP TOP NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top d-none d-lg-block">
        <div className="container">
          {/* Official Brand Logo & Name */}
          <Link className="navbar-brand text-decoration-none" to="/" aria-label="Classic Mun Bricks Home">
            <BrandLogo variant="navbar" />
          </Link>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse show" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
              <li className="nav-item">
                <NavLink 
                  to="/" 
                  end 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-house-door-fill me-1 opacity-75"></i> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/visit-us" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-box-seam-fill me-1 opacity-75"></i> Visit Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/projects" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-collection-fill me-1 opacity-75"></i> Projects
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/about-us" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-building-fill me-1 opacity-75"></i> About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/blog" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-journal-text me-1 opacity-75"></i> Blog
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-envelope-fill me-1 opacity-75"></i> Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MOBILE COMPACT TOP BRAND HEADER */}
      <header className="mobile-header d-lg-none sticky-top bg-charcoal text-white border-bottom border-secondary border-opacity-25 px-3 py-2">
        <div className="d-flex align-items-center justify-content-start">
          <Link className="navbar-brand text-white text-decoration-none d-inline-flex align-items-center m-0 p-0" to="/" aria-label="Classic Mun Bricks Home">
            <BrandLogo variant="mobileHeader" />
          </Link>
        </div>
      </header>



      {/* MOBILE APP-LIKE FIXED BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav d-lg-none" aria-label="Mobile Navigation">
        <div className="mobile-bottom-nav-inner">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-house-door-fill mobile-nav-icon"></i>
            <span className="mobile-nav-label">Home</span>
          </NavLink>

          <NavLink 
            to="/visit-us" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-box-seam-fill mobile-nav-icon"></i>
            <span className="mobile-nav-label">Visit Us</span>
          </NavLink>

          <NavLink 
            to="/projects" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-collection-fill mobile-nav-icon"></i>
            <span className="mobile-nav-label">Projects</span>
          </NavLink>

          <NavLink 
            to="/about-us" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-building-fill mobile-nav-icon"></i>
            <span className="mobile-nav-label">About</span>
          </NavLink>

          <NavLink 
            to="/contact" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-telephone-fill mobile-nav-icon"></i>
            <span className="mobile-nav-label">Contact</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default Navbar;


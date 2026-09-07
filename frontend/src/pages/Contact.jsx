import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CONTACT_CONFIG } from '../config/contact';
import { API_ENDPOINTS } from '../config/api';
import '../styles/contact.css';

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Product Enquiry',
  'Project Requirement',
  'Bulk Requirement',
  'Other',
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    enquiry_type: 'General Enquiry',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    document.title = 'Contact Us | Classic Mun Bricks';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid full name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else {
      const cleaned = formData.phone.replace(/[\s\+\-\(\)]/g, '');
      if (!/^\d{7,15}$/.test(cleaned)) {
        newErrors.phone = 'Please enter a valid contact phone number.';
      }
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your requirement.';
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Message should be at least 5 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setServerMessage('');

    if (!validateForm()) {
      toast.error('Please correct the highlighted errors in the form.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || '',
        location: formData.location.trim() || '',
        enquiry_type: formData.enquiry_type,
        message: formData.message.trim(),
      };

      const response = await fetch(API_ENDPOINTS.CONTACT_ENQUIRIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      let data = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          data = null;
        }
      } else {
        const text = await response.text().catch(() => '');
        console.error('CONTACT API NON-JSON RESPONSE:', {
          status: response.status,
          contentType,
          text: text.slice(0, 1000),
        });
      }

      console.log('CONTACT STATUS:', response.status);
      console.log('CONTENT TYPE:', contentType);
      console.log('SAFE RESPONSE BODY:', data ? '[JSON Received]' : 'Non-JSON/Empty');

      if (response.status === 201 && data && data.success) {
        setSubmitStatus('success');
        const successMsg = data.message || 'Thank you for reaching out! Our team will contact you shortly.';
        setServerMessage(successMsg);
        toast.success(successMsg);
        
        setFormData({
          name: '',
          phone: '',
          email: '',
          location: '',
          enquiry_type: 'General Enquiry',
          message: '',
        });
        setErrors({});
      } else if (response.status === 400) {
        setSubmitStatus('error');
        const fieldErrors = {};
        if (data && typeof data === 'object') {
          if (data.name) fieldErrors.name = Array.isArray(data.name) ? data.name[0] : data.name;
          if (data.phone) fieldErrors.phone = Array.isArray(data.phone) ? data.phone[0] : data.phone;
          if (data.email) fieldErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
          if (data.location) fieldErrors.location = Array.isArray(data.location) ? data.location[0] : data.location;
          if (data.enquiry_type) fieldErrors.enquiry_type = Array.isArray(data.enquiry_type) ? data.enquiry_type[0] : data.enquiry_type;
          if (data.message) fieldErrors.message = Array.isArray(data.message) ? data.message[0] : data.message;
        }
        setErrors(fieldErrors);
        const userMsg = (data && data.detail)
          ? data.detail
          : (Object.keys(fieldErrors).length > 0 ? 'Please correct the highlighted errors in the form.' : 'Something went wrong. Please try again or contact us directly.');
        setServerMessage(userMsg);
        toast.error(userMsg);
      } else if (response.status === 429) {
        setSubmitStatus('error');
        const rateMsg = 'Too many enquiries submitted recently. Please wait a few minutes before trying again.';
        setServerMessage(rateMsg);
        toast.error(rateMsg);
      } else {
        setSubmitStatus('error');
        const errText = 'Something went wrong. Please try again or contact us directly.';
        setServerMessage(errText);
        toast.error(errText);
      }
    } catch (err) {
      setSubmitStatus('error');
      const networkErr = 'Something went wrong. Please try again or contact us directly.';
      setServerMessage(networkErr);
      toast.error(networkErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      {/* ========================================================
          SECTION 1 — CONTACT HERO
          ======================================================== */}
      <section className="contact-hero text-center">
        <div className="contact-hero-overlay"></div>
        <div className="container position-relative z-1">
          <div className="mx-auto" style={{ maxWidth: '640px' }}>
            <div className="contact-eyebrow mb-2">
              <i className="bi bi-envelope-fill me-1"></i> CONTACT US
            </div>
            <h1 className="contact-hero-title mb-2">
              Let’s Talk About Your Next Project.
            </h1>
            <p className="lead text-light opacity-90 mb-0" style={{ fontSize: '1.05rem' }}>
              Whether you're planning a new build or looking for structural clay brick specifications, send us your requirement and our team will get in touch.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — CONTACT + ENQUIRY (DESKTOP TWO-COLUMN, MOBILE STACKED)
          ======================================================== */}
      <section className="contact-main-section">
        <div className="container">
          <div className="row g-5 align-items-start">
            {/* LEFT SIDE: Get in Touch & Quick Methods */}
            <div className="col-lg-5">
              <span className="text-terracotta fw-bold small text-uppercase letter-spacing-1 d-block mb-1">
                GET IN TOUCH
              </span>
              <h2 className="display-6 fw-bold mb-3">
                Get in Touch
              </h2>
              <p className="text-muted mb-4">
                We supply high-density structural clay bricks for projects across Kerala and Tamil Nadu. Share your requirements or reach out through our available channels.
              </p>

              {/* Quick Action Cards (Verified Business Contact Details) */}
              <div className="d-flex flex-column gap-3 mb-4">
                {/* Primary Phone */}
                <a href={`tel:${CONTACT_CONFIG.companyPhonePrimaryRaw}`} className="quick-action-card">
                  <div className="quick-action-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <div className="quick-action-title">Primary Call Line</div>
                    <div className="quick-action-sub">{CONTACT_CONFIG.companyPhonePrimary}</div>
                  </div>
                </a>

                {/* Secondary Phone */}
                <a href={`tel:${CONTACT_CONFIG.companyPhoneSecondaryRaw}`} className="quick-action-card">
                  <div className="quick-action-icon">
                    <i className="bi bi-telephone-outbound-fill"></i>
                  </div>
                  <div>
                    <div className="quick-action-title">Secondary Call Line</div>
                    <div className="quick-action-sub">{CONTACT_CONFIG.companyPhoneSecondary}</div>
                  </div>
                </a>

                {/* WhatsApp Direct Chat */}
                {CONTACT_CONFIG.companyWhatsApp && (
                  <a
                    href={`https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${encodeURIComponent(CONTACT_CONFIG.whatsappDefaultMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-action-card"
                  >
                    <div className="quick-action-icon" style={{ backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25D366' }}>
                      <i className="bi bi-whatsapp"></i>
                    </div>
                    <div>
                      <div className="quick-action-title">WhatsApp Direct Chat</div>
                      <div className="quick-action-sub">{CONTACT_CONFIG.companyWhatsAppDisplay}</div>
                    </div>
                  </a>
                )}


                {/* Email Address */}
                <a href={`mailto:${CONTACT_CONFIG.companyEmail}`} className="quick-action-card">
                  <div className="quick-action-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <div className="quick-action-title">Email Us</div>
                    <div className="quick-action-sub">{CONTACT_CONFIG.companyEmail}</div>
                  </div>
                </a>

                {/* Virtual Tour Link */}
                <Link to="/visit-us" className="quick-action-card">
                  <div className="quick-action-icon">
                    <i className="bi bi-box-seam-fill"></i>
                  </div>
                  <div>
                    <div className="quick-action-title">Virtual Factory Tour</div>
                    <div className="quick-action-sub">Explore our manufacturing facility online</div>
                  </div>
                </Link>
              </div>

              {/* Operational Footprint & Social Media Box */}
              <div className="contact-info-card">
                <h6 className="fw-bold mb-3 text-dark">Manufacturing Base & Official Profiles</h6>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <div className="fw-bold small text-dark">{CONTACT_CONFIG.companyAddress.name}</div>
                    <div className="small text-muted">
                      {CONTACT_CONFIG.companyAddress.formatted}
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="bi bi-share-fill"></i>
                  </div>
                  <div>
                    <div className="fw-bold small text-dark mb-1">Follow Our Official Pages</div>
                    <div className="d-flex align-items-center gap-3 pt-1">
                      <a 
                        href={CONTACT_CONFIG.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Classic Mun Bricks on Instagram"
                        className="text-dark opacity-85 fs-5 text-decoration-none"
                      >
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a 
                        href={CONTACT_CONFIG.socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Classic Mun Bricks on Facebook"
                        className="text-dark opacity-85 fs-5 text-decoration-none"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a 
                        href={CONTACT_CONFIG.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Classic Mun Bricks on YouTube"
                        className="text-dark opacity-85 fs-5 text-decoration-none"
                      >
                        <i className="bi bi-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <div className="fw-bold small text-dark">Working Hours</div>
                    <div className="small text-muted">
                      {CONTACT_CONFIG.businessHours}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: Primary Action (Enquiry Form) */}
            <div className="col-lg-7">
              <div className="form-card">
                <h3 className="h4 fw-bold mb-1" style={{ fontFamily: 'var(--cmb-font-heading)' }}>
                  Send an Enquiry
                </h3>
                <p className="text-muted small mb-4">
                  Please complete the form below to submit your requirement to our team. Fields marked (<span className="text-danger">*</span>) are required.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Full Name & Phone Row */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label-custom">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`form-control-custom ${errors.name ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.name && <div className="invalid-feedback-custom">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label-custom">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Contact phone number"
                        className={`form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.phone && <div className="invalid-feedback-custom">{errors.phone}</div>}
                    </div>
                  </div>

                  {/* Email & Location Row */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label-custom">
                        Email Address <span className="text-muted fw-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className={`form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.email && <div className="invalid-feedback-custom">{errors.email}</div>}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label-custom">
                        Location / City <span className="text-muted fw-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        autoComplete="address-level2"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City or district"
                        className="form-control-custom"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Enquiry Type Row */}
                  <div className="mb-3">
                    <label htmlFor="enquiry_type" className="form-label-custom">
                      Enquiry Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="enquiry_type"
                      name="enquiry_type"
                      value={formData.enquiry_type}
                      onChange={handleChange}
                      className="form-control-custom"
                      disabled={isSubmitting}
                    >
                      {ENQUIRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message / Requirement Row */}
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label-custom">
                      Message / Requirement <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your requirement, required brick quantity, project type, or target delivery location..."
                      className={`form-control-custom ${errors.message ? 'is-invalid' : ''}`}
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <div className="invalid-feedback-custom">{errors.message}</div>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-cmb-primary w-100 justify-content-center py-3 fs-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        SENDING ENQUIRY...
                      </>
                    ) : (
                      <>
                        Send Enquiry <i className="bi bi-send-fill ms-1"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — LOCATION SECTION (INDEPENDENT SEPARATE CONTAINER)
          ======================================================== */}
      <section className="location-section">
        <div className="container">
          <div className="location-card text-center mx-auto" style={{ maxWidth: '780px' }}>
            <span className="about-eyebrow mb-2">PLANT LOCATION</span>
            <h3 className="h4 fw-bold mt-2 mb-2" style={{ fontFamily: 'var(--cmb-font-heading)' }}>
              Visit Our Kerala Manufacturing Facility
            </h3>
            <p className="text-muted mb-4 mx-auto small" style={{ maxWidth: '580px' }}>
              Our manufacturing facility is situated in Kerala, serving direct site shipments across Kerala and Tamil Nadu.
            </p>

            {CONTACT_CONFIG.googleMapsEmbedSrc ? (
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden border border-secondary border-opacity-25">
                <iframe
                  src={CONTACT_CONFIG.googleMapsEmbedSrc}
                  title="Classic Mun Bricks Location Map"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            ) : (
              <div className="compact-placeholder-box d-flex flex-column align-items-center gap-3">
                <i className="bi bi-geo-alt-fill text-terracotta fs-2"></i>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Factory Location</h6>
                  <div className="small text-muted">
                    Map and directions will be available here once the verified factory location is configured.
                  </div>
                </div>
                <Link to="/visit-us" className="btn-cmb-outline-dark btn-sm px-3">
                  Take the Virtual Factory Tour <i className="bi bi-play-circle-fill ms-1"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — FINAL VIRTUAL TOUR CTA
          ======================================================== */}
      <section className="contact-final-cta text-center">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: '620px' }}>
            <h3 className="h4 fw-bold text-white mb-2" style={{ fontFamily: 'var(--cmb-font-heading)' }}>
              Want to See How Our Bricks Are Made?
            </h3>
            <p className="text-light-50 small mb-4">
              Explore the real production journey through our step-by-step virtual factory tour.
            </p>
            <Link to="/visit-us" className="btn-cmb-primary px-4 py-2">
              Visit Our Factory <i className="bi bi-play-fill ms-1"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;

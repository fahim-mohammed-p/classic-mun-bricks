import React from 'react';
import { CONTACT_CONFIG } from '../config/contact';

/**
 * Global Floating WhatsApp Contact Button Component
 * Positioned fixed at bottom-right across desktop and tablet;
 * Positioned safely above the app-like bottom navigation bar on mobile viewports.
 */
const WhatsAppButton = () => {
  if (!CONTACT_CONFIG.companyWhatsApp) return null;

  const encodedMessage = encodeURIComponent(CONTACT_CONFIG.whatsappDefaultMessage);
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Classic Mun Bricks on WhatsApp"
      title="Chat with us on WhatsApp"
      className="whatsapp-float-btn"
    >
      <i className="bi bi-whatsapp whatsapp-icon"></i>
      <span className="whatsapp-tooltip d-none d-lg-inline-block">Chat with us</span>
    </a>
  );
};

export default WhatsAppButton;

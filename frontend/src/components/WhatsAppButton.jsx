import React from 'react';
import { CONTACT_CONFIG } from '../config/contact';

/**
 * Global Floating Actions Component (Call + WhatsApp)
 * - On desktop: WhatsApp button fixed at bottom-right with hover tooltip.
 * - On mobile/tablet (< 992px): Stacked Call button directly ABOVE WhatsApp button,
 *   hovering safely above the mobile bottom navigation bar.
 */
const WhatsAppButton = () => {
  const hasWhatsApp = Boolean(CONTACT_CONFIG.companyWhatsApp);
  const hasPhone = Boolean(CONTACT_CONFIG.companyPhonePrimaryRaw || CONTACT_CONFIG.companyPhoneRaw);

  if (!hasWhatsApp && !hasPhone) return null;

  const encodedMessage = encodeURIComponent(CONTACT_CONFIG.whatsappDefaultMessage);
  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.companyWhatsApp}?text=${encodedMessage}`;
  const phoneRaw = CONTACT_CONFIG.companyPhonePrimaryRaw || CONTACT_CONFIG.companyPhoneRaw;

  return (
    <div className="floating-actions-stack" role="complementary" aria-label="Quick Contact Actions">
      {/* Mobile-Only Dedicated Floating Call Button (Placed directly ABOVE WhatsApp) */}
      {hasPhone && (
        <a
          href={`tel:${phoneRaw}`}
          aria-label="Call Classic Mun Bricks"
          title="Call"
          className="floating-action-btn call-float-btn d-lg-none"
        >
          <i className="bi bi-telephone-fill call-icon"></i>
        </a>
      )}

      {/* Floating WhatsApp Direct Button */}
      {hasWhatsApp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Classic Mun Bricks on WhatsApp"
          title="Chat with us on WhatsApp"
          className="floating-action-btn whatsapp-float-btn"
        >
          <i className="bi bi-whatsapp whatsapp-icon"></i>
          <span className="whatsapp-tooltip d-none d-lg-inline-block">Chat with us</span>
        </a>
      )}
    </div>
  );
};

export default WhatsAppButton;

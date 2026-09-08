import React, { useMemo } from 'react';

/**
 * Renders blog content safely without XSS risk.
 * Supports structured plain-text paragraphs, markdown-style headers & lists,
 * and safely sanitized basic semantic HTML tags.
 */
const ALLOWED_TAGS = new Set([
  'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'BLOCKQUOTE',
  'STRONG', 'EM', 'B', 'I', 'A', 'BR', 'HR', 'SPAN'
]);

const ALLOWED_ATTRS = {
  'A': ['href', 'target', 'rel', 'class'],
  '*': ['class']
};

function sanitizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toUpperCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      // Return text content of disallowed elements to prevent code injection
      return node.textContent;
    }

    const cleanEl = document.createElement(tagName.toLowerCase());

    // Copy allowed attributes safely
    const allowedForTag = ALLOWED_ATTRS[tagName] || ALLOWED_ATTRS['*'] || [];
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      const name = attr.name.toLowerCase();
      const val = attr.value;

      if (name.startsWith('on') || val.toLowerCase().includes('javascript:') || val.toLowerCase().includes('data:text/html')) {
        continue; // Block all inline event handlers and javascript: URIs
      }

      if (allowedForTag.includes(name) || ALLOWED_ATTRS['*'].includes(name)) {
        if (name === 'href') {
          // Verify safe protocol
          if (/^(https?:|mailto:|tel:|\/|#)/i.test(val)) {
            cleanEl.setAttribute('href', val);
            cleanEl.setAttribute('target', '_blank');
            cleanEl.setAttribute('rel', 'noopener noreferrer');
          }
        } else {
          cleanEl.setAttribute(name, val);
        }
      }
    }

    // Recursively sanitize children
    node.childNodes.forEach((child) => {
      const sanitizedChild = sanitizeNode(child);
      if (typeof sanitizedChild === 'string') {
        cleanEl.appendChild(document.createTextNode(sanitizedChild));
      } else if (sanitizedChild) {
        cleanEl.appendChild(sanitizedChild);
      }
    });

    return cleanEl;
  }

  return null;
}

function sanitizeHtml(htmlString) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const container = document.createElement('div');
    doc.body.childNodes.forEach((node) => {
      const sanitized = sanitizeNode(node);
      if (typeof sanitized === 'string') {
        container.appendChild(document.createTextNode(sanitized));
      } else if (sanitized) {
        container.appendChild(sanitized);
      }
    });
    return container.innerHTML;
  } catch {
    return '';
  }
}

const SafeBlogContent = ({ content }) => {
  const renderedContent = useMemo(() => {
    if (!content || typeof content !== 'string') return null;

    const trimmed = content.trim();

    // Check if content is primarily HTML
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);

    if (hasHtmlTags) {
      const cleanHtml = sanitizeHtml(trimmed);
      return (
        <div 
          className="blog-content-body blog-html-body"
          dangerouslySetInnerHTML={{ __html: cleanHtml }} 
        />
      );
    }

    // Otherwise render plain text with structured blocks
    const blocks = trimmed.split(/\n{2,}/);

    return (
      <div className="blog-content-body">
        {blocks.map((block, idx) => {
          const trimmedBlock = block.trim();
          if (!trimmedBlock) return null;

          // H2 Heading (e.g. ## Title)
          if (trimmedBlock.startsWith('## ')) {
            return (
              <h2 key={idx} className="blog-content-h2">
                {trimmedBlock.replace(/^##\s+/, '')}
              </h2>
            );
          }

          // H3 Heading (e.g. ### Title)
          if (trimmedBlock.startsWith('### ')) {
            return (
              <h3 key={idx} className="blog-content-h3">
                {trimmedBlock.replace(/^###\s+/, '')}
              </h3>
            );
          }

          // Blockquote (e.g. > Quote)
          if (trimmedBlock.startsWith('> ')) {
            return (
              <blockquote key={idx} className="blog-content-quote">
                <p className="mb-0">{trimmedBlock.replace(/^>\s+/, '')}</p>
              </blockquote>
            );
          }

          // Unordered list (lines starting with - or *)
          const lines = trimmedBlock.split('\n');
          const isBulletList = lines.length > 1 && lines.every((l) => /^[-*]\s+/.test(l.trim()));
          if (isBulletList) {
            return (
              <ul key={idx} className="blog-content-list">
                {lines.map((line, lIdx) => (
                  <li key={lIdx}>{line.trim().replace(/^[-*]\s+/, '')}</li>
                ))}
              </ul>
            );
          }

          // Numbered list (lines starting with 1. 2.)
          const isNumberedList = lines.length > 1 && lines.every((l) => /^\d+\.\s+/.test(l.trim()));
          if (isNumberedList) {
            return (
              <ol key={idx} className="blog-content-list">
                {lines.map((line, lIdx) => (
                  <li key={lIdx}>{line.trim().replace(/^\d+\.\s+/, '')}</li>
                ))}
              </ol>
            );
          }

          // Standard paragraph with preserved inline linebreaks
          return (
            <p key={idx} className="blog-content-paragraph">
              {lines.map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {line}
                  {lineIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    );
  }, [content]);

  return renderedContent;
};

export default SafeBlogContent;

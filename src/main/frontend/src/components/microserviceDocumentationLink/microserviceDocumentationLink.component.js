import React from 'react';

const style = { color: '#f69805' };

const documentationStyle = {
  color: 'rgba(0, 0, 0, 0.4)',
  zIndex: 999,
  position: 'absolute',
  right: '0.5em',
  bottom: '0.5em'
};

const MicroserviceDocumentationLink = () => (
  <span style={documentationStyle}>
    <a
      href="https://example.com/display/ZOE/Anbindung+neuer+Webservices"
      rel="noopener noreferrer"
      target="_blank"
      alt="Zur Dokumentation"
      style={{ textDecoration: 'none' }}
    >
      <span
        style={style}
      >
&#x025A4;
      </span>
      <span style={style}>
Doku
      </span>

    </a>
  </span>

);

export default MicroserviceDocumentationLink;

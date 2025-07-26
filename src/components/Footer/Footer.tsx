import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer id="contact-footer" className="footer">
      <div className="footer-logos">
        <img 
          src={require("../../images/inova.png")} 
          alt="Logo INOVA" 
          className="footer-logo" 
        />
        <img 
          src={require("../../images/icon2.png")} 
          alt="Logo Governo" 
          className="footer-logo" 
        />
        <img 
          src={require("../../images/secti.png")} 
          alt="Logo SECTI" 
          className="footer-logo" 
        />
      </div>
      <div className="footer-contact">
        Contato: 
        <a 
          href="mailto:buscasusgp2@gmail.com" 
          className="footer-contact-link"
        >
          buscasusgp2@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;

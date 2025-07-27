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
          className="footer-contact-link"
        >
          buscasaude@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { useEffect, useRef } from "react"
import "./App.css";
import homeImage from "./images/home.png";
import iconImage from "./images/icon2.png";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import HealthUnitsSearch from "./components/HealthUnitsSearch/HealthUnitsSearch";
import Footer from "./components/Footer/Footer";
import { Bubble } from "@typebot.io/react";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConsulta, setShowConsulta] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  useEffect(() => {
    if (showConsulta) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [showConsulta]);

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    setMenuOpen(false);
  }

  const isHomePage = location.pathname === "/";

  return (

    <div className="app" style={{ zIndex: 1000 }}>
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={iconImage} alt="BuscaSUS Logo" />
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <button className="nav-link" onClick={() => scrollToSection('hero-section')}>Home</button>
            <button className="nav-link" onClick={() => scrollToSection('about-section')}>Sobre</button>
            <button className="nav-link" onClick={() => scrollToSection('contact-footer')}>Contato</button>
          </nav>
        </div>
      </header>

      {isHomePage ? (
        <>

          <section id="hero-section" className="hero" style={{ height: "700px" }}>
            <div className="hero-background" style={{ backgroundImage: `url(${homeImage})` }}></div>
            <div className="container">
              <div className="hero-content">
                <div className="hero-left">
                  <h1 className="hero-title">BuscaSUS</h1>
                  <h2 className="hero-subtitle">Acesse informações relevantes de saúde</h2>
                  <p className="hero-description">
                    O BuscaSUS é um portal digital que facilita o acesso aos serviços do SUS. Consulte vacinação, exames,
                    atendimentos e encontre unidades de saúde de forma simples, rápida e integrada.
                  </p>
                  <div className="hero-buttons">
                    <button className="btn" style={{ marginTop: "-300px" }} onClick={() => setShowConsulta(true)}>
                      Buscar unidades →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about-section" className="about">
            <div className="container">
              <h2 className="about-title">Sobre o projeto</h2>
              <p className="about-description">
                O BuscaSUS é a sua porta de entrada para uma saúde pública mais acessível e transparente. Descubra nossos
                serviços e experimente uma nova forma de gerenciar seu cuidado com agilidade e confiança.
              </p>
              <div className="about-box">
                <p className="about-box-text">
                  Cada detalhe foi pensado para você. Aqui, a tecnologia anda de mãos dadas com o cuidado:
                  facilitamos o acesso à informação, aos serviços de saúde e ao seu histórico, porque acreditamos que estar
                  bem informado é o primeiro passo para ser bem cuidado.
                </p>
              </div>
            </div>
          </section>
 <Bubble
      typebot="faq-endyvb9"
      apiHost="https://typebot.io"
      previewMessage={{
        message: "Tire sua Dúvida!",
        autoShowDelay: 3000,
        avatarUrl:
          "https://s3.typebot.io/public/workspaces/cm6ff7j1v0016la03qkghe8f9/typebots/cx0019o0d4ojqk141endyvb9/hostAvatar?v=1753447962746",
      }}
      theme={{
        button: {
          backgroundColor: "#D1FAE5",
          customIconSrc:
            "https://s3.typebot.io/public/workspaces/cm6ff7j1v0016la03qkghe8f9/typebots/cx0019o0d4ojqk141endyvb9/bubble-icon?v=1753457917053",
        },
        previewMessage: { backgroundColor: "#D1FAE5", textColor: "#000" },
      }}
    />
        </>
      ) : (
        <div className="modal-wrapper">
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/unidades-proximas" element={<h1>Unidades Próximas</h1>} />
          </Routes>
        </div>
      )}
      <section>
        <Bubble
          typebot="faq-endyvb9"
          apiHost="https://typebot.io"
          previewMessage={{
            message: "Tire sua Dúvida!",
            autoShowDelay: 3000,
            avatarUrl:
              "https://s3.typebot.io/public/workspaces/cm6ff7j1v0016la03qkghe8f9/typebots/cx0019o0d4ojqk141endyvb9/hostAvatar?v=1753447962746",
          }}
          theme={{
            button: {
              backgroundColor: "#D1FAE5",
              customIconSrc:
                "https://s3.typebot.io/public/workspaces/cm6ff7j1v0016la03qkghe8f9/typebots/cx0019o0d4ojqk141endyvb9/bubble-icon?v=1753457917053",
            },
            previewMessage: { backgroundColor: "#D1FAE5", textColor: "#000" },
          }}
        />
      </section>
      <Footer />

      {showConsulta && (
        <div className="modal-overlay" onClick={() => setShowConsulta(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxHeight: '100vh', overflowY: 'auto' }}>
            <HealthUnitsSearch onClose={() => setShowConsulta(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

import React from "react";
import { useEffect } from "react"
import homeImage from "./images/home.png";
import iconImage from "./images/icon2.png";
import { Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import HealthUnitsSearch from "./components/HealthUnitsSearch/HealthUnitsSearch";
import Footer from "./components/Footer";

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
    <div className="w-full min-h-screen flex flex-col bg-background text-text-dark" style={{ zIndex: 1000 }}>
      <header className="bg-primary w-full h-20 fixed z-10">
        <div className="max-w-7xl mx-auto px-5 w-full flex justify-between items-center h-full">
          <div className="pt-2.5">
            <img src={iconImage} alt="BuscaSUS Logo" className="h-17.5 block" />
          </div>
          <button className="hidden text-2xl text-text-dark cursor-pointer md:block" onClick={toggleMenu}>
            ☰
          </button>
          <nav className={`p-4 px-8 flex items-center justify-center gap-8 flex-wrap ${menuOpen ? "block" : "hidden md:flex"}`}>
            <button className="text-text-dark text-base font-semibold py-1.5 px-2.5 rounded transition-colors hover:text-primary" onClick={() => scrollToSection('hero-section')}>Home</button>
            <button className="text-text-dark text-base font-semibold py-1.5 px-2.5 rounded transition-colors hover:text-primary" onClick={() => scrollToSection('about-section')}>Sobre</button>
            <button className="text-text-dark text-base font-semibold py-1.5 px-2.5 rounded transition-colors hover:text-primary" onClick={() => scrollToSection('contact-footer')}>Contato</button>
          </nav>
        </div>
      </header>
      
      {isHomePage ? (
        <>
          <section id="hero-section" className="pt-36 pb-20 w-full relative overflow-hidden bg-gradient-to-br from-background via-accent-light to-green-200 h-700">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-10" style={{ backgroundImage: `url(${homeImage})` }}></div>
            <div className="max-w-7xl mx-auto px-5 w-full relative z-30">
              <div className="flex justify-start items-center w-full">
                <div className="flex flex-col max-w-2xl">
                  <h1 className="text-8xl font-bold text-primary-dark mb-5 drop-shadow-lg">BuscaSUS</h1>
                  <h2 className="text-2xl font-normal text-text-dark mb-6">Acesse informações relevantes de saúde</h2>
                  <p className="text-xl text-text-light leading-tight mb-10 drop-shadow-sm">
                    O BuscaSUS é um portal digital que facilita o acesso aos serviços do SUS. Consulte vacinação, exames,
                    atendimentos e encontre unidades de saúde de forma simples, rápida e integrada.
                  </p>
                  <div className="flex flex-col gap-4" style={{ marginLeft: "800px", marginTop: "-300px" }}>
                    <button 
                      className="block bg-white border-2 border-black py-3.5 px-7 rounded-full text-base font-semibold w-64 text-left cursor-pointer transition-all hover:bg-primary hover:-translate-y-0.5" 
                      onClick={() => setShowConsulta(true)}
                    >
                      Buscar unidades →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section id="about-section" className="py-20 bg-background w-full">
            <div className="max-w-7xl mx-auto px-5 w-full">
              <h2 className="text-4xl font-bold text-primary-dark text-center mb-8">Sobre o projeto</h2>
              <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto mb-12 leading-relaxed">
                O BuscaSUS é a sua porta de entrada para uma saúde pública mais acessível e transparente. Descubra nossos
                serviços e experimente uma nova forma de gerenciar seu cuidado com agilidade e confiança.
              </p>
              <div className="flex items-start gap-6 py-10 px-10 rounded-xl bg-accent-light shadow-lg before:content-['❤️'] before:text-5xl before:pr-2.5">
                <p className="text-lg text-slate-800 leading-relaxed">
                  Cada detalhe foi pensado para você. Aqui, a tecnologia anda de mãos dadas com o cuidado:
                  facilitamos o acesso à informação, aos serviços de saúde e ao seu histórico, porque acreditamos que estar
                  bem informado é o primeiro passo para ser bem cuidado.
                </p>
              </div>
            </div>
          </section>
          
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-5 w-full">
              <h1 className="text-4xl text-center mb-15 text-primary-dark font-bold">Conheça as funcionalidades</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg flex flex-col">
                  <div className="mx-auto my-5">
                    <img src={require("./images/lupa.png")} alt="Ícone de lupa - Dados de saúde" className="max-w-30 h-25 object-contain mx-auto" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl text-gray-800 mb-4">Conheça dados importantes de saúde</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                      Acesse seu prontuário, resultados de exames e vacinas registradas em um só lugar.
                    </p>
                    <button className="bg-primary-dark text-white border-none py-3 px-4 rounded-full text-base font-bold cursor-pointer transition-all hover:bg-primary hover:-translate-y-0.5 text-center">
                      <Link to="/dados-saude" className="no-underline text-white">Clique aqui →</Link>
                    </button>
                  </div>
                </div>
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-lg flex flex-col">
                  <div className="mx-auto my-5">
                    <img src={require("./images/medic.png")} alt="Ícone de localização" className="max-w-30 h-25 object-contain mx-auto" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl text-gray-800 mb-4">Veja a unidade mais próxima</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                      Descubra de forma simples onde estão os postos, clínicas e hospitais do SUS no mapa interativo.
                    </p>
                    <button className="bg-primary-dark text-white border-none py-3 px-4 rounded-full text-base font-bold cursor-pointer transition-all hover:bg-primary hover:-translate-y-0.5 text-center">
                      <Link to="/unidades-proximas" className="no-underline text-white">Clique aqui →</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="fixed inset-0 w-full h-full bg-blue-100 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/dados-saude" element={<h1>Dados de Saúde</h1>} />
            <Route path="/unidades-proximas" element={<h1>Unidades Próximas</h1>} />
          </Routes>
        </div>
      )}
      
      <Footer />
      
      {showConsulta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden z-50" onClick={() => setShowConsulta(false)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <HealthUnitsSearch onClose={() => setShowConsulta(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

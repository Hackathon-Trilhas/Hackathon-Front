import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import logoImage from "../../images/icon2.png";
import axios from "axios"; 
interface LoginState {
  email: string;
  senha: string;
  error: string;
  showPassword: boolean;
}
interface LoginProps {
  onClose: () => void;
  onCadastroClick: () => void;
  onEsqueciSenhaClick: () => void;
  onLoginSuccess: () => void;
}
const Login: React.FC<LoginProps> = ({ onClose, onCadastroClick, onEsqueciSenhaClick, onLoginSuccess }) => {
  const [state, setState] = useState<LoginState>({
    email: "",
    senha: "",
    error: "",
    showPassword: false,
  });
  const handleLogin = async () => {
    setState((prev) => ({ ...prev, error: "" })); 
    if (!state.email || !state.senha) {
      setState((prev) => ({ ...prev, error: "Por favor, preencha e-mail e senha." }));
      return;
    }
    try {
      const response = await axios.post("https://desafio-05-api.onrender.com/api/auth/login", {
        email: state.email,
        password: state.senha, 
      });
      localStorage.setItem("authToken", response.data.token); 
      localStorage.setItem("isLoggedIn", "true");
      setState((prev) => ({ ...prev, error: "" })); 
      onLoginSuccess(); 
    } catch (error: unknown) { 
      console.error("Erro ao tentar login:", error);
      if (axios.isAxiosError(error)) { 
        if (error.response) { 
          const axiosResponseData = error.response.data; 
          setState((prev) => ({ ...prev, error: axiosResponseData.message || "Credenciais inválidas." }));
        } else if (error.request) { 
          setState((prev) => ({ ...prev, error: "Sem resposta do servidor. Verifique sua conexão ou o CORS." }));
          console.error("Erro na requisição Axios (sem resposta):", error.request);
        } else { 
          setState((prev) => ({ ...prev, error: "Erro ao configurar a requisição. Tente novamente." }));
          console.error("Erro na configuração da requisição Axios:", error.message);
        }
      } else { 
        setState((prev) => ({ ...prev, error: "Ocorreu um erro inesperado. Tente novamente." }));
        console.error("Erro inesperado:", error);
      }
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "https://desafio-05-api.onrender.com/api/auth/google";
  };
  const handleGitHubLogin = () => {
    window.location.href = "https://desafio-05-api.onrender.com/api/auth/github";
  };
  return (
    <div
      className="login-container"
      onClick={(e) => e.stopPropagation()}>
      <div className="login-modal">
        <button
          className="login-back-button"
          onClick={onClose}>
          &larr;
        </button>
        <div className="login-logo-container">
          <img
            src={logoImage}
            alt="BuscaSUS Logo"
            className="login-logo"/>
        </div>
        <form className="login-form">
          <h2 className="login-title">Login</h2>
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
            className="login-input"
            placeholder="Email"/>
          <div className="password-input-container">
            <input
              type={state.showPassword ? "text" : "password"}
              value={state.senha}
              onChange={(e) => setState((prev) => ({ ...prev, senha: e.target.value }))}
              className="login-input"
              placeholder="Senha"/>
            <span
              className="password-toggle"
              onClick={() => setState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}>
              {state.showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <Link
            to="/esqueci-senha"
            className="forgot-password-link"
            onClick={(e) => { e.preventDefault(); onEsqueciSenhaClick(); }}>
            Esqueceu a senha?
          </Link>
          {state.error && <p className="error-message">{state.error}</p>}
          <button
            type="button"
            className="login-button"
            onClick={handleLogin}>
            Entrar
          </button>
          <div className="social-login-container">
            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleLogin}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google Icon"
                className="social-icon"/>
              Entrar com Google
            </button>
            <button
              type="button"
              className="github-login-button"
              onClick={handleGitHubLogin}>
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub Icon"
                className="social-icon"/>
              Entrar com GitHub
            </button>
          </div>
          <p className="register-text">
            Não tem uma conta?
            <button
              type="button"
              className="register-link"
              onClick={(e) => { e.stopPropagation(); onCadastroClick(); }}>
              Cadastre-se
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
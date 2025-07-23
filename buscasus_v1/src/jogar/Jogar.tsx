import React, { useEffect } from 'react';

// Este componente tem uma única responsabilidade: redirecionar o usuário para a URL do jogo.
const Jogar: React.FC = () => {
  
  console.log("Componente Jogar: Iniciando redirecionamento para a URL correta do jogo.");

  // O hook useEffect é usado para executar uma ação assim que o componente é carregado.
  useEffect(() => {
    // A linha abaixo muda a URL na barra de endereço do navegador,
    // enviando o usuário para o site do jogo.
    window.location.href = 'https://saude-em-acao-ten.vercel.app/';
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez.

  // É uma boa prática exibir uma mensagem de fallback para o usuário
  // enquanto o navegador processa o redirecionamento.
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#D3FCEA',
      fontFamily: 'sans-serif',
      color: '#333'
    }}>
      <h1>Redirecionando para o jogo...</h1>
    </div>
  );
};

export default Jogar;
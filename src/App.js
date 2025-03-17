import React from 'react';
import './App.scss';
import fotoPerfil from './img/foto-perfil.jpg'; // Importe a imagem

function App() {
  // Array de projetos
  const projects = [
    {
      id: 1,
      title: 'Site de Notícias',
      description: 'Um site moderno para leitura de notícias.',
      image: 'https://via.placeholder.com/300x200', // Imagem de exemplo
      link: 'https://exemplo.com',
    },
    {
      id: 2,
      title: 'E-commerce',
      description: 'Loja online com carrinho de compras.',
      image: 'https://via.placeholder.com/300x200', // Imagem de exemplo
      link: 'https://exemplo.com',
    },
    {
      id: 3,
      title: 'Blog Pessoal',
      description: 'Blog com artigos sobre tecnologia.',
      image: 'https://via.placeholder.com/300x200', // Imagem de exemplo
      link: 'https://exemplo.com',
    },
  ];

  return (
    <div className="App">
      <header className="header">
        <h1>
          <div className="logo"></div>
          Meu Portfólio
        </h1>
        <nav>
          <a href="#">Home</a>
          <a href="#">Sobre</a>
          <a href="#">Portfólio</a>
          <a href="#">Contato</a>
        </nav>
      </header>
      <main className="main-content">
        <section className="hero">
          <h2>Bem-vindo ao meu portfólio!</h2>
          <div className="about-me">
            <div className="profile-picture">
              <img src={fotoPerfil} alt="Foto de Perfil" /> {/* Use a imagem importada */}
            </div>
            <div className="about-me-text">
              <h3>Sobre Mim</h3>
              <p>
                Olá! Meu nome é Assis Neto, sou um desenvolvedor apaixonado por
                tecnologia. Com 4 de experiência dentro da area de TI. Adoro desafios e estou sempre
                buscando aprender coisas novas. Aqui você pode conferir alguns dos meus
                trabalhos!
              </p>
            </div>
          </div>
        </section>

        {/* Seção do Portfólio */}
        <section className="portfolio">
          <h2>Meus Projetos</h2>
          <div className="portfolio-grid">
            {projects.map((project) => (
              <div key={project.id} className="portfolio-item">
                <img src={project.image} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  Ver Projeto
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
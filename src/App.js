import React, { useEffect, useRef } from 'react';
import './App.scss';
import fotoPerfil from './img/foto-perfil.jpg';

function App() {
  const sectionsRef = useRef([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Adiciona a classe 'visible'
            observer.unobserve(entry.target); // Para de observar após a animação
          }
        });
      },
      {
        threshold: 0.1, // Dispara a animação quando 10% da seção estiver visível
      }
    );

    // Observa cada seção
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Limpa o observer ao desmontar o componente
    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>
          <div className="logo"></div>
          Meu Portfólio
        </h1>
        <nav>
          <a href="#home">Home</a>
          <a href="#portfolio">Portfólio</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>
      <main className="main-content">
        {/* Seção Home */}
        <section
          id="home"
          className="section-animate" // Adiciona a classe de animação
          ref={(el) => (sectionsRef.current[0] = el)} // Referência para a seção
        >
          <div className="welcome-section">
            <div className="welcome-content">
              <h2>Bem-vindo ao meu portfólio!</h2>
              <p className="intro-text">
                Olá! Seja bem-vindo ao meu espaço digital. Sou um <strong>Desenvolvedor Front-End</strong>, apaixonado por tecnologia e criação de interfaces web modernas e responsivas.
              </p>
              <div className="about-me-text">
                <h3>Sobre Mim</h3>
                <p>
                  Meu nome é <strong>Assis Neto</strong>. Tenho <strong>4 anos de experiência</strong> na área de TI, adoro desafios e estou sempre buscando aprender coisas novas. Aqui você pode conferir alguns dos meus trabalhos!
                </p>
              </div>
              <div className="skills">
                <h3>Habilidades Técnicas</h3>
                <ul>
                  <li>Front-End: <strong>HTML</strong>, <strong>CSS</strong>, <strong>JavaScript</strong>, <strong>React</strong></li>
                  <li>Back-End: <strong>PHP</strong>, <strong>MySQL</strong></li>
                  <li>Ferramentas: <strong>Git</strong>, <strong>GitHub</strong>, <strong>VS Code</strong></li>
                </ul>
              </div>
            </div>
            <div className="profile-picture">
              <img src={fotoPerfil} alt="Foto de Perfil" />
            </div>
          </div>
        </section>

        {/* Seção Portfólio */}
        <section
          id="portfolio"
          className="section-animate" // Adiciona a classe de animação
          ref={(el) => (sectionsRef.current[1] = el)} // Referência para a seção
        >
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

        {/* Seção Contato */}
        <section
          id="contato"
          className="section-animate" // Adiciona a classe de animação
          ref={(el) => (sectionsRef.current[2] = el)} // Referência para a seção
        >
          <h2>Contato</h2>
          <p>
            Entre em contato comigo através do formulário abaixo ou pelas redes sociais.
          </p>
          <form className="contact-form">
            <input type="text" placeholder="Seu nome" required />
            <input type="email" placeholder="Seu e-mail" required />
            <textarea placeholder="Sua mensagem" rows="5" required></textarea>
            <button type="submit">Enviar</button>
          </form>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Assis</p>
          <div className="footer-contact">
            <p>Email: <a href="mailto:assis@example.com">assis@example.com</a></p>
            <p>Telefone: <a href="tel:+5511999999999">+55 (11) 99999-9999</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import { FormEvent, useEffect, useMemo, useState } from 'react';
import './App.scss';
import fotoPerfil from './img/foto-perfil.jpg';
import { contact, projectConfig } from './config';
import { GithubRepo, Language } from './types';
import { useGithubRepos } from './useGithubRepos';

const copy = {
  pt: {
    nav: ['Início', 'Sobre', 'Experiência', 'Projetos', 'Contato'],
    heroKicker: 'Desenvolvedor Full Stack',
    heroTitle: 'Transformo problemas complexos em produtos digitais simples.',
    heroText: 'Sou Assis Pires Neto, desenvolvedor apaixonado por criar experiências web robustas, acessíveis e prontas para escalar.',
    contact: 'Vamos conversar',
    resume: 'Baixar currículo',
    aboutTitle: 'Sobre mim',
    about: 'Com experiência em desenvolvimento web, atuo da arquitetura ao detalhe da interface. Gosto de colaborar com times que valorizam qualidade, aprendizado contínuo e impacto real para o usuário.',
    skillsTitle: 'Habilidades',
    experienceTitle: 'Experiência',
    projectsTitle: 'Projetos reais, atualizados automaticamente',
    projectsText: 'Uma seleção dos meus repositórios públicos no GitHub, ordenados por relevância e atualização.',
    search: 'Buscar projeto...',
    all: 'Todas as tecnologias',
    code: 'Código',
    demo: 'Demo',
    stars: 'estrelas',
    empty: 'Nenhum projeto encontrado com esses filtros.',
    loading: 'Carregando projetos do GitHub...',
    apiError: 'Não foi possível atualizar o GitHub agora. Exibindo o que estiver disponível.',
    contactTitle: 'Vamos construir algo juntos?',
    contactText: 'Estou aberto a conversas sobre oportunidades, projetos e colaboração.',
    send: 'Enviar mensagem',
    formName: 'Seu nome',
    formEmail: 'Seu e-mail',
    formMessage: 'Como posso ajudar?',
  },
  en: {
    nav: ['Home', 'About', 'Experience', 'Projects', 'Contact'],
    heroKicker: 'Full Stack Developer',
    heroTitle: 'I turn complex problems into simple digital products.',
    heroText: 'I am Assis Pires Neto, a developer passionate about building robust, accessible and scalable web experiences.',
    contact: 'Let’s talk',
    resume: 'Download resume',
    aboutTitle: 'About me',
    about: 'With experience in web development, I work from architecture to interface details. I enjoy teams that value quality, continuous learning and real user impact.',
    skillsTitle: 'Skills',
    experienceTitle: 'Experience',
    projectsTitle: 'Real projects, updated automatically',
    projectsText: 'A selection of my public GitHub repositories, sorted by relevance and recent activity.',
    search: 'Search projects...',
    all: 'All technologies',
    code: 'Code',
    demo: 'Demo',
    stars: 'stars',
    empty: 'No project matches these filters.',
    loading: 'Loading GitHub projects...',
    apiError: 'GitHub could not be updated right now. Showing available data.',
    contactTitle: 'Let’s build something together?',
    contactText: 'I am open to conversations about opportunities, projects and collaboration.',
    send: 'Send message',
    formName: 'Your name',
    formEmail: 'Your email',
    formMessage: 'How can I help?',
  },
} as const;

const skills = {
  'Back-end': ['Java', 'Spring Boot', 'Node.js', 'NestJS', 'REST APIs'],
  'Front-end': ['TypeScript', 'React', 'Next.js', 'HTML', 'CSS/Sass'],
  'Dados': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
  'DevOps & ferramentas': ['Git', 'GitHub Actions', 'Docker', 'Linux'],
};

const experiences = [
  { company: 'SafeWeb', role: 'Desenvolvedor Full Stack', period: 'Experiência profissional', text: 'Desenvolvimento de soluções web com foco em segurança, manutenção e evolução de produtos.' },
  { company: 'InterOP', role: 'Desenvolvedor de software', period: 'Experiência profissional', text: 'Construção de integrações e APIs para conectar processos e sistemas.' },
  { company: 'Volpato', role: 'Desenvolvedor', period: 'Experiência profissional', text: 'Implementação de funcionalidades e interfaces orientadas às necessidades do negócio.' },
  { company: 'ESJC', role: 'Desenvolvedor', period: 'Experiência profissional', text: 'Primeiros projetos profissionais e consolidação de fundamentos de desenvolvimento.' },
];

const formatDate = (date: string, language: Language) =>
  new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' }).format(new Date(date));

function ProjectCard({ repo, language }: { repo: GithubRepo; language: Language }) {
  const text = copy[language];
  return (
    <article className="project-card">
      <div className="project-card__top">
        <span className="project-icon" aria-hidden="true">{'</>'}</span>
        {repo.stargazers_count > 0 && <span aria-label={`${repo.stargazers_count} ${text.stars}`}>★ {repo.stargazers_count}</span>}
      </div>
      <h3>{repo.name}</h3>
      <p>{repo.description || (language === 'pt' ? 'Projeto desenvolvido por Assis.' : 'Project built by Assis.')}</p>
      <div className="tag-list">
        {[repo.language, ...repo.topics].filter(Boolean).slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <small>{language === 'pt' ? 'Atualizado' : 'Updated'} {formatDate(repo.updated_at, language)}</small>
      <div className="project-actions">
        <a href={repo.html_url} target="_blank" rel="noreferrer">{text.code} <span aria-hidden="true">↗</span></a>
        {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer" className="button button--small">{text.demo}</a>}
      </div>
    </article>
  );
}

function App() {
  const { repos, loading, error } = useGithubRepos();
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('portfolio-language') as Language) || 'pt');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('portfolio-theme') === 'dark');
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('');
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    localStorage.setItem('portfolio-language', language);
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.section-animate').forEach((section) => section.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }), { threshold: 0.12 });
    document.querySelectorAll('.section-animate').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const technologies = useMemo(() => Array.from(new Set(repos.flatMap((repo) => [repo.language, ...repo.topics].filter(Boolean) as string[]))).sort(), [repos]);
  const filteredRepos = useMemo(() => repos
    .filter((repo) => !query || repo.name.toLowerCase().includes(query.toLowerCase()))
    .filter((repo) => !technology || repo.language === technology || repo.topics.includes(technology))
    .sort((a, b) => Number(projectConfig.featured.includes(b.name.toLowerCase())) - Number(projectConfig.featured.includes(a.name.toLowerCase()))), [repos, query, technology]);
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Contato de ${form.get('name')}`)}&body=${encodeURIComponent(String(form.get('message')))}`;
  };

  return (
    <div className="App">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Assis Pires Neto"><span>AP</span><strong>Assis<span>.</span></strong></a>
        <nav aria-label="Navegação principal">{text.nav.map((item, index) => <a href={`#${['inicio', 'sobre', 'experiencia', 'projetos', 'contato'][index]}`} key={item}>{item}</a>)}</nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}>{darkMode ? '☼' : '☾'}</button>
          <button className="language-button" onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')} aria-label="Mudar idioma">{language === 'pt' ? 'EN' : 'PT'}</button>
        </div>
      </header>
      <main>
        <section id="inicio" className="hero section-animate">
          <div className="hero__content"><p className="eyebrow">{text.heroKicker}</p><h1>{text.heroTitle}</h1><p className="hero__text">{text.heroText}</p><div className="hero__actions"><a className="button" href="#contato">{text.contact} <span aria-hidden="true">↗</span></a><a className="text-link" href={contact.resume} download>{text.resume} <span aria-hidden="true">↓</span></a></div></div>
          <div className="hero__visual"><div className="hero__glow" /><img src={fotoPerfil} alt="Assis Pires Neto" /></div>
        </section>
        <section id="sobre" className="section section-animate"><div className="section-heading"><p className="eyebrow">01 / {text.aboutTitle}</p><h2>{text.aboutTitle}</h2></div><div className="about-grid"><p className="about-lead">{text.about}</p><div className="skills-grid">{Object.entries(skills).map(([group, items]) => <div key={group}><h3>{group}</h3><div className="tag-list">{items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></div></section>
        <section id="experiencia" className="section section-animate"><div className="section-heading"><p className="eyebrow">02 / {text.experienceTitle}</p><h2>{text.experienceTitle}</h2></div><div className="timeline">{experiences.map((experience) => <article className="timeline-item" key={experience.company}><span className="timeline-dot" /><div><p className="eyebrow">{experience.period}</p><h3>{experience.company}</h3><strong>{experience.role}</strong><p>{experience.text}</p></div></article>)}</div></section>
        <section id="projetos" className="section section-animate"><div className="section-heading projects-heading"><div><p className="eyebrow">03 / {text.projectsTitle}</p><h2>{text.projectsTitle}</h2><p>{text.projectsText}</p></div><a className="text-link" href={contact.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a></div><div className="project-filters"><label><span className="sr-only">{text.search}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} /></label><label><span className="sr-only">{text.all}</span><select value={technology} onChange={(event) => setTechnology(event.target.value)}><option value="">{text.all}</option>{technologies.map((item) => <option key={item}>{item}</option>)}</select></label></div>{error && <p className="notice" role="status">{text.apiError}</p>}{loading ? <div className="project-grid" aria-label={text.loading}>{[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}</div> : filteredRepos.length ? <div className="project-grid">{filteredRepos.map((repo) => <ProjectCard key={repo.id} repo={repo} language={language} />)}</div> : <p className="empty-state">{text.empty}</p>}</section>
        <section id="formacao" className="section compact-section section-animate"><div className="section-heading"><p className="eyebrow">04 / Formação</p><h2>Aprendizado contínuo</h2></div><div className="education-card"><div><h3>Desenvolvimento de sistemas</h3><p>Formação e cursos complementares em desenvolvimento web, arquitetura de software e boas práticas.</p></div><span>2020 — hoje</span></div></section>
        <section id="contato" className="contact-section section-animate"><div><p className="eyebrow">05 / {text.contactTitle}</p><h2>{text.contactTitle}</h2><p>{text.contactText}</p><div className="social-links"><a href={`mailto:${contact.email}`}>E-mail ↗</a><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp ↗</a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div><form onSubmit={submitContact}><label>{text.formName}<input name="name" required /></label><label>{text.formEmail}<input name="email" type="email" required /></label><label>{text.formMessage}<textarea name="message" rows={4} required /></label><button className="button" type="submit">{text.send} ↗</button></form></section>
      </main>
      <footer><span>© {new Date().getFullYear()} Assis Pires Neto</span><a href="#inicio">Voltar ao topo ↑</a></footer>
    </div>
  );
}

export default App;

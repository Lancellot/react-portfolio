import { FormEvent, useEffect, useMemo, useState } from 'react';
import './App.scss';
import fotoPerfil from './img/foto-perfil.jpg';
import { contact } from './config';
import { groupGithubRepos, getRepositoryRole } from './githubService';
import { Language, PortfolioProject } from './types';
import { useGithubRepos } from './useGithubRepos';

const copy = {
  pt: {
    nav: ['In\u00edcio', 'Sobre', 'Experi\u00eancia', 'Projetos', 'Forma\u00e7\u00e3o', 'Contato'],
    heroRole: 'Desenvolvedor Back-end Jr. na SimFrete',
    heroTitle: 'Construo produtos digitais e APIs para resolver problemas reais.',
    heroText:
      'Sou Assis Pires Neto, desenvolvedor Full Stack de Porto Alegre, RS, com foco em back-end e aplica\u00e7\u00f5es web.',
    contact: 'Entre em contato',
    resume: 'Baixar curr\u00edculo',
    about: 'Sobre mim',
    skills: 'Habilidades',
    aboutText:
      'Desenvolvedor Full Stack com 5 anos em TI (suporte, infraestrutura e melhoria de processos) e 1 ano em desenvolvimento de software. Constr\u00f3i aplica\u00e7\u00f5es web e APIs REST com TypeScript, Node.js, React, NestJS e Next.js, com PostgreSQL e MySQL. Experi\u00eancia com Scrum, Git, JWT, testes unit\u00e1rios e Clean Code.',
    experience: 'Experi\u00eancia',
    projects: 'Projetos',
    projectIntro: 'Projetos reais dos meus reposit\u00f3rios p\u00fablicos no GitHub.',
    search: 'Buscar projeto pelo nome',
    all: 'Todas as tecnologias',
    loading: 'Carregando projetos do GitHub',
    apiError:
      'N\u00e3o foi poss\u00edvel atualizar os projetos. Exibindo dados salvos ou exemplos locais.',
    empty: 'Nenhum projeto encontrado.',
    code: 'C\u00f3digo',
    backend: 'Back-end',
    frontend: 'Front-end',
    demo: 'Demo',
    updated: 'Atualizado',
    education: 'Forma\u00e7\u00e3o e cursos',
    contactTitle: 'Vamos conversar?',
    contactText: 'Estou aberto a oportunidades, projetos e colabora\u00e7\u00f5es.',
    name: 'Seu nome',
    email: 'Seu e-mail',
    message: 'Sua mensagem',
    send: 'Enviar mensagem',
    languages: 'Idiomas',
    current: 'Ago/2026 - atual',
    independent: 'Projetos independentes e freelance',
    education1: 'An\u00e1lise e Desenvolvimento de Sistemas',
    education2: 'T\u00e9cnico em Inform\u00e1tica',
    courses: 'Cursos e certifica\u00e7\u00f5es',
    ambassador: 'Embaixador Alumni da Generation Brasil',
    mentoring: 'Voluntariado com mentoria t\u00e9cnica',
  },
  en: {
    nav: ['Home', 'About', 'Experience', 'Projects', 'Education', 'Contact'],
    heroRole: 'Junior Back-end Developer at SimFrete',
    heroTitle: 'I build digital products and APIs to solve real problems.',
    heroText:
      'I am Assis Pires Neto, a Full Stack developer from Porto Alegre, Brazil, focused on back-end and web applications.',
    contact: 'Get in touch',
    resume: 'Download resume',
    about: 'About me',
    skills: 'Skills',
    aboutText:
      'Full Stack developer with 5 years in IT (support, infrastructure and process improvement) and 1 year in software development. I build web applications and REST APIs with TypeScript, Node.js, React, NestJS and Next.js, using PostgreSQL and MySQL. Experienced with Scrum, Git, JWT, unit testing and Clean Code.',
    experience: 'Experience',
    projects: 'Projects',
    projectIntro: 'Real projects from my public GitHub repositories.',
    search: 'Search projects by name',
    all: 'All technologies',
    loading: 'Loading GitHub projects',
    apiError: 'Projects could not be refreshed. Showing saved data or local examples.',
    empty: 'No projects found.',
    code: 'Code',
    backend: 'Back-end',
    frontend: 'Front-end',
    demo: 'Demo',
    updated: 'Updated',
    education: 'Education and courses',
    contactTitle: "Let's talk",
    contactText: 'I am open to opportunities, projects and collaboration.',
    name: 'Your name',
    email: 'Your email',
    message: 'Your message',
    send: 'Send message',
    languages: 'Languages',
    current: 'Aug/2026 - present',
    independent: 'Independent and freelance projects',
    education1: 'Systems Analysis and Development',
    education2: 'IT Technician',
    courses: 'Courses and certifications',
    ambassador: 'Generation Brasil Alumni Ambassador',
    mentoring: 'Volunteer technical mentoring',
  },
} as const;

const skills = [
  {
    group: 'Back-end',
    items: ['TypeScript', 'JavaScript', 'Node.js', 'NestJS', 'REST APIs', 'JWT', 'Swagger'],
  },
  { group: 'Front-end', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
  { group: 'Banco de dados', items: ['PostgreSQL', 'MySQL', 'TypeORM'] },
  { group: 'Qualidade e ferramentas', items: ['Jest', 'Git', 'Scrum', 'Clean Code'] },
  { group: 'Cloud', items: ['AWS'] },
];

const courses = [
  'Dev Full Stack (+PraTi)',
  'Bootcamp Full-Stack JavaScript (Generation Brasil)',
  'Santander Imers\u00e3o Digital - Trilha IA (Alura)',
  'AWS Cloud Practitioner (TIDWIT)',
  'freeCodeCamp',
  'Blip',
  'ITIL v4 Foundation',
];
const navIds = ['inicio', 'sobre', 'experiencia', 'projetos', 'formacao', 'contato'];
const formatDate = (date: string, language: Language) =>
  new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
const getPreference = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const savePreference = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional. */
  }
};

function ProjectCard({ project, language }: { project: PortfolioProject; language: Language }) {
  const text = copy[language];
  return (
    <article className="project-card">
      <div className="project-card__top">
        <span className="project-icon" aria-hidden="true">
          {'</>'}
        </span>
        <div className="project-card__badges">
          {project.featured && (
            <span className="featured-badge">{language === 'pt' ? 'Destaque' : 'Featured'}</span>
          )}
          {project.stargazers_count > 0 && (
            <span
              aria-label={`${project.stargazers_count} ${language === 'pt' ? 'estrelas' : 'stars'}`}
            >
              &#9733; {project.stargazers_count}
            </span>
          )}
        </div>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="repository-meta">
        {project.repositories.map((repo) => {
          const role = getRepositoryRole(repo);
          const roleLabel =
            role === 'backend' ? text.backend : role === 'frontend' ? text.frontend : text.code;
          const repoTags = [repo.language, ...repo.topics].filter(Boolean).join(' · ');
          return (
            <div className="repository-meta__item" key={`${repo.id}-meta`}>
              <strong>
                {roleLabel} <span aria-hidden="true">·</span> {repo.name}
              </strong>
              <p>
                {repo.description ||
                  (language === 'pt' ? 'Descrição não informada.' : 'No description provided.')}
              </p>
              <small>
                {repoTags ||
                  (language === 'pt' ? 'Tecnologias não informadas' : 'No technologies listed')}
                {' · '}
                {repo.stargazers_count} {language === 'pt' ? 'estrelas' : 'stars'}
                {' · '}
                {text.updated} {formatDate(repo.updated_at, language)}
              </small>
            </div>
          );
        })}
      </div>
      <div className="tag-list">
        {project.technologies.slice(0, 10).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <small>
        {text.updated} {formatDate(project.updated_at, language)}
      </small>
      <div className="project-actions">
        {project.repositories.map((repo) => {
          const role = getRepositoryRole(repo);
          const label =
            role === 'backend' ? text.backend : role === 'frontend' ? text.frontend : text.code;
          return (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer">
              {label} <span aria-hidden="true">&#8599;</span>
            </a>
          );
        })}
        {project.repositories
          .filter((repo) => repo.homepage)
          .map((repo) => (
            <a
              key={`${repo.id}-demo`}
              className="button button--small"
              href={repo.homepage || undefined}
              target="_blank"
              rel="noreferrer"
            >
              {text.demo}
            </a>
          ))}
      </div>
    </article>
  );
}

function App() {
  const { repos, loading, error } = useGithubRepos();
  const [language, setLanguage] = useState<Language>(() =>
    getPreference('portfolio-language') === 'en' ? 'en' : 'pt',
  );
  const [darkMode, setDarkMode] = useState(() => getPreference('portfolio-theme') === 'dark');
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('');
  const [activeSection, setActiveSection] = useState('inicio');
  const text = copy[language];
  const groupedProjects = useMemo(() => groupGithubRepos(repos), [repos]);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    savePreference('portfolio-language', language);
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    savePreference('portfolio-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.section-animate'));
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }),
      { rootMargin: '-25% 0px -65% 0px' },
    );
    navIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const technologies = useMemo(
    () => Array.from(new Set(groupedProjects.flatMap((project) => project.technologies))).sort(),
    [groupedProjects],
  );
  const filteredProjects = useMemo(
    () =>
      groupedProjects
        .filter(
          (project) =>
            !query ||
            `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase()),
        )
        .filter((project) => !technology || project.technologies.includes(technology)),
    [groupedProjects, query, technology],
  );

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Portfolio contact from ${String(data.get('name'))}`;
    const body = `${String(data.get('message'))}\n\n${String(data.get('email'))}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="App">
      <a className="skip-link" href="#conteudo">
        {language === 'pt' ? 'Pular para o conte\u00fado' : 'Skip to content'}
      </a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Assis Pires Neto">
          <span>AP</span>
          <strong>
            Assis<span>.</span>
          </strong>
        </a>
        <nav aria-label={language === 'pt' ? 'Navega\u00e7\u00e3o principal' : 'Main navigation'}>
          {text.nav.map((item, index) => (
            <a
              className={activeSection === navIds[index] ? 'active' : ''}
              aria-current={activeSection === navIds[index] ? 'location' : undefined}
              href={`#${navIds[index]}`}
              key={navIds[index]}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={
              darkMode
                ? language === 'pt'
                  ? 'Ativar modo claro'
                  : 'Switch to light mode'
                : language === 'pt'
                  ? 'Ativar modo escuro'
                  : 'Switch to dark mode'
            }
          >
            {darkMode ? '\u263c' : '\u263e'}
          </button>
          <button
            className="language-button"
            type="button"
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            aria-label={language === 'pt' ? 'Switch to English' : 'Mudar para portugu\u00eas'}
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>
        </div>
      </header>
      <main id="conteudo">
        <section id="inicio" className="hero section-animate">
          <div className="hero__content">
            <p className="eyebrow">{text.heroRole}</p>
            <h1>{text.heroTitle}</h1>
            <p className="hero__text">{text.heroText}</p>
            <div className="hero__actions">
              <a className="button" href="#contato">
                {text.contact} <span aria-hidden="true">&#8599;</span>
              </a>
              <a className="text-link" href={contact.resume} download>
                {text.resume} <span aria-hidden="true">&#8595;</span>
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__glow" />
            <img src={fotoPerfil} alt="Assis Pires Neto" fetchPriority="high" />
          </div>
        </section>
        <section id="sobre" className="section section-animate">
          <div className="section-heading">
            <p className="eyebrow">01 / {text.about}</p>
            <h2>{text.about}</h2>
          </div>
          <div className="about-grid">
            <div>
              <p className="about-lead">{text.aboutText}</p>
              <div className="recognition-list">
                <p>{text.ambassador}</p>
                <p>{text.mentoring}</p>
              </div>
            </div>
            <div className="skills-grid">
              <h3 className="skills-heading">{text.skills}</h3>
              {skills.map(({ group, items }) => (
                <div key={group}>
                  <h3>
                    {language === 'en' && group === 'Banco de dados'
                      ? 'Databases'
                      : language === 'en' && group === 'Qualidade e ferramentas'
                        ? 'Quality and tools'
                        : group}
                  </h3>
                  <div className="tag-list">
                    {items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="experiencia" className="section section-animate">
          <div className="section-heading">
            <p className="eyebrow">02 / {text.experience}</p>
            <h2>{text.experience}</h2>
          </div>
          <div className="timeline">
            <article className="timeline-item">
              <span className="timeline-dot" />
              <div>
                <p className="eyebrow">{text.current}</p>
                <h3>SimFrete</h3>
                <strong>
                  {language === 'pt' ? 'Desenvolvedor Back-end Jr.' : 'Junior Back-end Developer'}
                </strong>
              </div>
            </article>
            <article className="timeline-item">
              <span className="timeline-dot" />
              <div>
                <p className="eyebrow">{language === 'pt' ? 'Full Stack' : 'Full Stack'}</p>
                <h3>{text.independent}</h3>
                <p>
                  {language === 'pt'
                    ? 'Desenvolvimento de aplicacoes web e APIs para projetos proprios e clientes.'
                    : 'Web applications and APIs for independent and freelance projects.'}
                </p>
              </div>
            </article>
            {['InterOP', 'Volpato', 'ESJC'].map((company) => (
              <article className="timeline-item" key={company}>
                <span className="timeline-dot" />
                <div>
                  <p className="eyebrow">
                    {language === 'pt' ? 'Experiencia anterior em TI' : 'Previous IT experience'}
                  </p>
                  <h3>{company}</h3>
                  <p>
                    {language === 'pt'
                      ? 'Suporte, infraestrutura e melhoria de processos.'
                      : 'Support, infrastructure and process improvement.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="projetos" className="section">
          <div className="section-heading projects-heading">
            <div>
              <p className="eyebrow">03 / {text.projects}</p>
              <h2>{text.projects}</h2>
              <p>{text.projectIntro}</p>
            </div>
            <a className="text-link" href={contact.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
          <div className="project-filters">
            <label>
              <span className="sr-only">{text.search}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.search}
              />
            </label>
            <label>
              <span className="sr-only">{text.all}</span>
              <select value={technology} onChange={(event) => setTechnology(event.target.value)}>
                <option value="">{text.all}</option>
                {technologies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          {error && (
            <p className="notice" role="status">
              {text.apiError}
            </p>
          )}
          {loading ? (
            <div className="project-grid" aria-label={text.loading} aria-busy="true">
              {[1, 2, 3].map((item) => (
                <div className="skeleton" key={item} />
              ))}
            </div>
          ) : filteredProjects.length ? (
            <div className="project-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} language={language} />
              ))}
            </div>
          ) : (
            <p className="empty-state" role="status">
              {text.empty}
            </p>
          )}
        </section>
        <section id="formacao" className="section section-animate">
          <div className="section-heading">
            <p className="eyebrow">04 / {text.education}</p>
            <h2>{text.education}</h2>
          </div>
          <div className="education-grid">
            <article className="education-card">
              <h3>{text.education1}</h3>
              <p>Ulbra</p>
              <span>06/2026</span>
            </article>
            <article className="education-card">
              <h3>{text.education2}</h3>
              <p>Senac RS</p>
              <span>2017</span>
            </article>
            <article className="education-card courses-card">
              <h3>{text.courses}</h3>
              <ul>
                {courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>
        <section id="contato" className="contact-section section-animate">
          <div>
            <p className="eyebrow">05 / {text.contactTitle}</p>
            <h2>{text.contactTitle}</h2>
            <p>{text.contactText}</p>
            <div className="social-links">
              <a href={`mailto:${contact.email}`}>E-mail</a>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={contact.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
          <form onSubmit={submitContact}>
            <label>
              {text.name}
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              {text.email}
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              {text.message}
              <textarea name="message" rows={4} required />
            </label>
            <button className="button" type="submit">
              {text.send} <span aria-hidden="true">&#8599;</span>
            </button>
          </form>
        </section>
      </main>
      <footer>
        <span>&copy; {new Date().getFullYear()} Assis Pires Neto</span>
        <a href="#inicio">{language === 'pt' ? 'Voltar ao topo' : 'Back to top'} &#8593;</a>
      </footer>
    </div>
  );
}

export default App;

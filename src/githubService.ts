import { CACHE_KEY, CACHE_TTL, GITHUB_USER } from './config';
import { projectConfig } from './projects.config';
import { GithubRepo, PortfolioProject } from './types';

interface CachedRepos {
  expiresAt: number;
  repos: GithubRepo[];
}
const isBrowser = typeof window !== 'undefined';

const staticRepo = (
  id: number,
  name: string,
  description: string,
  role: 'backend' | 'frontend',
  homepage: string | null = null,
  updatedAt = '2026-01-01T00:00:00Z',
  stars = 0,
  topics: string[] = [],
): GithubRepo => ({
  id,
  name,
  full_name: `${GITHUB_USER}/${name}`,
  description,
  html_url: `https://github.com/${GITHUB_USER}/${name}`,
  homepage,
  language: 'TypeScript',
  topics,
  stargazers_count: stars,
  updated_at: updatedAt,
  fork: false,
  archived: false,
});

export const fallbackRepos: GithubRepo[] = [
  staticRepo(
    1,
    'vou-ali-backend-nest',
    'Projeto academico para planejamento de viagens, com API NestJS, TypeORM e autenticacao JWT.',
    'backend',
    null,
    '2026-06-16T21:17:49Z',
    2,
    ['bcrypt', 'jwt-authentication', 'nestjs', 'nodejs', 'swagger', 'typeorm', 'typescript'],
  ),
  staticRepo(
    2,
    'vou-ali-react-ts-tailwind',
    'Aplicacao web React, TypeScript e Vite para planejar roteiros, atividades e despesas de viagem.',
    'frontend',
    'https://vou-ali-react-ts-tailwind.vercel.app/',
    '2026-06-16T21:13:00Z',
    2,
    ['axios-react', 'docker', 'tailwindcss', 'typescript', 'vite'],
  ),
  staticRepo(
    3,
    'ride-backend',
    'API NestJS para gerenciamento de caronas, usuarios e destinos.',
    'backend',
    null,
    '2026-04-15T19:31:59Z',
  ),
  staticRepo(
    4,
    'ride-frontend',
    'Interface React e TypeScript para compartilhamento de caronas.',
    'frontend',
    'https://ride-frontend-xi.vercel.app',
    '2026-04-15T18:57:08Z',
  ),
];

function readCache(): GithubRepo[] | null {
  if (!isBrowser) return null;
  try {
    const value = window.localStorage.getItem(CACHE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as CachedRepos;
    return parsed.expiresAt > Date.now() && Array.isArray(parsed.repos) ? parsed.repos : null;
  } catch {
    return null;
  }
}

function writeCache(repos: GithubRepo[]): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ repos, expiresAt: Date.now() + CACHE_TTL }),
    );
  } catch {
    /* Cache storage is optional. */
  }
}

export const getCachedRepos = (): GithubRepo[] | null => readCache();

function isGithubRepo(value: unknown): value is GithubRepo {
  if (!value || typeof value !== 'object') return false;
  const repo = value as Partial<GithubRepo>;
  return (
    typeof repo.id === 'number' &&
    typeof repo.name === 'string' &&
    typeof repo.full_name === 'string' &&
    typeof repo.html_url === 'string' &&
    typeof repo.updated_at === 'string' &&
    Array.isArray(repo.topics) &&
    typeof repo.stargazers_count === 'number' &&
    typeof repo.fork === 'boolean' &&
    typeof repo.archived === 'boolean'
  );
}

export async function fetchGithubRepos(fetcher: typeof fetch = fetch): Promise<GithubRepo[]> {
  const token = process.env.REACT_APP_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const repos: GithubRepo[] = [];

  for (let page = 1; ; page += 1) {
    const response = await fetcher(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&page=${page}`,
      { headers },
    );
    if (!response.ok)
      throw new Error(
        response.status === 403
          ? 'GitHub API rate limit reached.'
          : 'Unable to load GitHub repositories.',
      );
    const body: unknown = await response.json();
    if (!Array.isArray(body) || !body.every(isGithubRepo))
      throw new Error('GitHub returned an invalid repository list.');
    repos.push(...body);
    if (body.length < 100) break;
  }

  const filtered = repos.filter(
    (repo) =>
      (projectConfig.includeForks ||
        !repo.fork ||
        projectConfig.projects.some(
          (project) =>
            project.allowForks &&
            project.repositoryNames.some((name) => normalize(name) === normalize(repo.name)),
        )) &&
      (projectConfig.includeArchived || !repo.archived) &&
      !projectConfig.excludeRepositories.includes(repo.name.toLowerCase()),
  );
  writeCache(filtered);
  return filtered;
}

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
const uniqueStrings = (values: string[]) =>
  Array.from(new Map(values.map((value) => [value.toLowerCase(), value])).values());
const isBackend = (repo: GithubRepo) => /back.?end|backend|api|server/i.test(repo.name);
const isFrontend = (repo: GithubRepo) => /front.?end|frontend|client|web|react/i.test(repo.name);

export function groupGithubRepos(repos: GithubRepo[]): PortfolioProject[] {
  const assigned = new Set<number>();
  const projects: PortfolioProject[] = projectConfig.projects
    .map((config) => {
      const names = config.repositoryNames.map(normalize);
      const matches = repos.filter((repo) =>
        names.some((name) => {
          const repoName = normalize(repo.name);
          return repoName === name;
        }),
      );
      matches.forEach((repo) => assigned.add(repo.id));
      const featuredByTopic = matches.some((repo) => repo.topics.includes('featured'));
      return {
        id: config.id,
        name: config.title,
        description: config.description,
        repositories: matches,
        technologies: uniqueStrings([
          ...config.technologies,
          ...matches.flatMap((repo) => [repo.language, ...repo.topics].filter(Boolean) as string[]),
        ]),
        updated_at:
          matches
            .map((repo) => repo.updated_at)
            .sort()
            .pop() || '2026-01-01T00:00:00Z',
        stargazers_count: matches.reduce((total, repo) => total + repo.stargazers_count, 0),
        featured: config.featured || featuredByTopic,
      };
    })
    .filter((project) => project.repositories.length > 0 || project.featured);

  repos
    .filter((repo) => !assigned.has(repo.id))
    .forEach((repo) =>
      projects.push({
        id: `repo-${repo.id}`,
        name: repo.name,
        description: repo.description || 'Projeto publicado por Assis Pires Neto.',
        repositories: [repo],
        technologies: uniqueStrings([repo.language, ...repo.topics].filter(Boolean) as string[]),
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count,
        featured:
          repo.topics.includes('featured') || projectConfig.featured.includes(normalize(repo.name)),
      }),
    );

  return projects.sort((a, b) => {
    const featuredDifference = Number(b.featured) - Number(a.featured);
    if (featuredDifference) return featuredDifference;
    const aPriority = projectConfig.projects.findIndex((project) => project.id === a.id);
    const bPriority = projectConfig.projects.findIndex((project) => project.id === b.id);
    if (aPriority >= 0 || bPriority >= 0) {
      if (aPriority < 0) return 1;
      if (bPriority < 0) return -1;
      return aPriority - bPriority;
    }
    return b.updated_at.localeCompare(a.updated_at);
  });
}

export function getRepositoryRole(repo: GithubRepo): 'backend' | 'frontend' | 'repository' {
  if (isBackend(repo)) return 'backend';
  if (isFrontend(repo)) return 'frontend';
  return 'repository';
}

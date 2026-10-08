import { CACHE_KEY, CACHE_TTL, GITHUB_USER, projectConfig } from './config';
import { GithubRepo } from './types';

export const fallbackRepos: GithubRepo[] = [
  {
    id: 1, name: 'velo', full_name: `${GITHUB_USER}/velo`,
    description: 'Projeto web desenvolvido com foco em experiência e performance.',
    html_url: `https://github.com/${GITHUB_USER}/velo`, homepage: null, language: 'TypeScript',
    topics: ['featured', 'react'], stargazers_count: 0, updated_at: '2025-01-01T00:00:00Z', fork: false, archived: false,
  },
  {
    id: 2, name: 'personal-blog', full_name: `${GITHUB_USER}/personal-blog`,
    description: 'Blog pessoal para compartilhar ideias e aprendizados.',
    html_url: `https://github.com/${GITHUB_USER}/personal-blog`, homepage: null, language: 'TypeScript',
    topics: ['featured', 'nextjs'], stargazers_count: 0, updated_at: '2025-01-01T00:00:00Z', fork: false, archived: false,
  },
];

interface CachedRepos {
  expiresAt: number;
  repos: GithubRepo[];
}

const readCache = (): GithubRepo[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as CachedRepos;
    return parsed.expiresAt > Date.now() ? parsed.repos : null;
  } catch {
    return null;
  }
};

const writeCache = (repos: GithubRepo[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ repos, expiresAt: Date.now() + CACHE_TTL }));
  } catch {
    // Cache availability must not prevent the portfolio from rendering.
  }
};

export const getCachedRepos = (): GithubRepo[] | null => readCache();

export async function fetchGithubRepos(): Promise<GithubRepo[]> {
  const token = process.env.REACT_APP_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const repos: GithubRepo[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&page=${page}`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(response.status === 403 ? 'GitHub API rate limit reached.' : 'Unable to load GitHub repositories.');
    }
    const pageRepos = (await response.json()) as GithubRepo[];
    repos.push(...pageRepos);
    if (pageRepos.length < 100) break;
    page += 1;
  }

  const filtered = repos.filter(
    (repo) => (projectConfig.includeForks || !repo.fork) && (projectConfig.includeArchived || !repo.archived),
  );
  writeCache(filtered);
  return filtered;
}

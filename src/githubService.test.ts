import { fetchGithubRepos, getRepositoryRole, groupGithubRepos } from './githubService';
import { GithubRepo } from './types';

const makeRepo = (overrides: Partial<GithubRepo> = {}): GithubRepo => ({
  id: 10,
  name: 'sample',
  full_name: 'Lancellot/sample',
  description: 'Sample project',
  html_url: 'https://github.com/Lancellot/sample',
  homepage: null,
  language: 'TypeScript',
  topics: [],
  stargazers_count: 0,
  updated_at: '2026-08-01T00:00:00Z',
  fork: false,
  archived: false,
  ...overrides,
});

beforeEach(() => localStorage.clear());

test('fetches every page, filters forks, archived repos and the portfolio, then caches for one hour', async () => {
  const firstPage = Array.from({ length: 100 }, (_, index) =>
    makeRepo({ id: index + 1, name: `repo-${index + 1}` }),
  );
  firstPage[1] = makeRepo({ id: 2, name: 'forked', fork: true });
  firstPage[2] = makeRepo({ id: 3, name: 'archived', archived: true });
  firstPage[3] = makeRepo({ id: 4, name: 'react-portfolio' });
  const pages = [firstPage, [makeRepo({ id: 101, name: 'last-page' })]];
  const fetcher = jest.fn().mockImplementation((_url: string) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(pages.shift()),
    }),
  );

  const repos = await fetchGithubRepos(fetcher as typeof fetch);

  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(fetcher.mock.calls[0][0]).toContain('per_page=100&sort=updated&page=1');
  expect(fetcher.mock.calls[1][0]).toContain('page=2');
  expect(repos).toHaveLength(98);
  const cached = JSON.parse(localStorage.getItem('assis-github-repos-v2') || '{}');
  expect(cached.expiresAt - Date.now()).toBeGreaterThan(59 * 60 * 1000);
});

test('reports rate limits clearly', async () => {
  const fetcher = jest.fn().mockResolvedValue({ ok: false, status: 403 });
  await expect(fetchGithubRepos(fetcher as typeof fetch)).rejects.toThrow('rate limit');
});

test('times out requests that never resolve', async () => {
  jest.useFakeTimers();
  const fetcher = jest.fn(
    (_url: string, options?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        options?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
      }),
  );
  const request = fetchGithubRepos(fetcher as typeof fetch);

  jest.advanceTimersByTime(12_000);
  await expect(request).rejects.toThrow('timed out');
  jest.useRealTimers();
});

test('keeps only the Velo forks explicitly configured as project repositories', async () => {
  const fetcher = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      makeRepo({ id: 20, name: 'ride-backend', fork: true }),
      makeRepo({ id: 21, name: 'ride-frontend', fork: true }),
      makeRepo({ id: 22, name: 'unrelated-fork', fork: true }),
    ],
  });

  const repos = await fetchGithubRepos(fetcher as typeof fetch);

  expect(repos.map((repo) => repo.name)).toEqual(['ride-backend', 'ride-frontend']);
});

test('groups configured product repositories into featured projects and detects repository roles', () => {
  const projects = groupGithubRepos([
    makeRepo({ id: 1, name: 'vou-ali-backend-nest', homepage: 'https://api.example.test' }),
    makeRepo({ id: 2, name: 'vou-ali-react-ts-tailwind', language: 'TypeScript' }),
    makeRepo({ id: 3, name: 'community-tool', topics: ['featured'] }),
  ]);

  expect(projects[0].name).toBe('Vou Ali');
  expect(projects[0].repositories).toHaveLength(2);
  expect(projects[0].featured).toBe(true);
  expect(getRepositoryRole(projects[0].repositories[0])).toBe('backend');
  expect(getRepositoryRole(projects[0].repositories[1])).toBe('frontend');
  expect(projects.find((project) => project.name === 'community-tool')?.featured).toBe(true);
});

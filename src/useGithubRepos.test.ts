import { renderHook, waitFor } from '@testing-library/react';
import { useGithubRepos } from './useGithubRepos';

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

test('loads the static fallback when GitHub is unavailable', async () => {
  (global.fetch as jest.Mock).mockRejectedValue(new Error('offline'));
  const { result } = renderHook(() => useGithubRepos());

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toBe('offline');
  expect(result.current.repos.map((repo) => repo.name)).toContain('vou-ali-backend-nest');
});

test('loads repository data from GitHub', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 42,
        name: 'new-project',
        full_name: 'Lancellot/new-project',
        description: null,
        html_url: 'https://github.com/Lancellot/new-project',
        homepage: null,
        language: 'TypeScript',
        topics: [],
        stargazers_count: 0,
        updated_at: '2026-09-01T00:00:00Z',
        fork: false,
        archived: false,
      },
    ],
  });
  const { result } = renderHook(() => useGithubRepos());

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.repos[0].name).toBe('new-project');
  expect(result.current.error).toBeNull();
});

test('uses a fresh local cache without making an API request', async () => {
  localStorage.setItem(
    'assis-github-repos-v2',
    JSON.stringify({
      expiresAt: Date.now() + 60_000,
      repos: [
        {
          id: 7,
          name: 'cached-project',
          full_name: 'Lancellot/cached-project',
          description: null,
          html_url: 'https://github.com/Lancellot/cached-project',
          homepage: null,
          language: 'TypeScript',
          topics: [],
          stargazers_count: 0,
          updated_at: '2026-09-01T00:00:00Z',
          fork: false,
          archived: false,
        },
      ],
    }),
  );
  const { result } = renderHook(() => useGithubRepos());

  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.repos[0].name).toBe('cached-project');
  expect(global.fetch).not.toHaveBeenCalled();
});

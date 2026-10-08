import { useEffect, useState } from 'react';
import { fallbackRepos, fetchGithubRepos, getCachedRepos } from './githubService';
import { GithubState } from './types';

export function useGithubRepos(): GithubState {
  const cached = getCachedRepos();
  const [state, setState] = useState<GithubState>({
    repos: cached || [],
    loading: !cached,
    error: null,
    fromCache: Boolean(cached),
  });

  useEffect(() => {
    let active = true;
    fetchGithubRepos()
      .then((repos) => {
        if (active) setState({ repos, loading: false, error: null, fromCache: false });
      })
      .catch((error: unknown) => {
        if (active) {
          setState((current) => ({
            repos: current.repos.length ? current.repos : fallbackRepos,
            loading: false,
            error: error instanceof Error ? error.message : 'Unable to load projects.',
            fromCache: current.repos.length > 0,
          }));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

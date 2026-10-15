import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cacheGithubRepos,
  fallbackRepos,
  fetchGithubReposPage,
  getCachedRepos,
  groupGithubRepos,
} from './githubService';
import { PROJECTS_PER_BATCH } from './config';
import { GithubRepo, GithubState } from './types';

export function useGithubRepos(): GithubState {
  const [cached] = useState(() => getCachedRepos());
  const reposRef = useRef<GithubRepo[]>(cached?.repos || []);
  const nextPageRef = useRef(cached?.nextPage || 1);
  const hasMoreRef = useRef(cached?.hasMore ?? true);
  const requestInProgress = useRef(false);
  const [state, setState] = useState({
    repos: reposRef.current,
    loading: !cached,
    loadingMore: false,
    error: null as string | null,
    fromCache: Boolean(cached),
    hasMore: hasMoreRef.current,
  });

  const loadUntilProjectCount = useCallback(async (targetCount: number, initial = false) => {
    if (requestInProgress.current || !hasMoreRef.current) return;
    requestInProgress.current = true;
    setState((current) => ({
      ...current,
      loading: initial,
      loadingMore: !initial,
      error: null,
    }));

    try {
      while (hasMoreRef.current && groupGithubRepos(reposRef.current).length < targetCount) {
        const page = await fetchGithubReposPage(nextPageRef.current, PROJECTS_PER_BATCH);
        const currentIds = new Set(reposRef.current.map((repo) => repo.id));
        reposRef.current = [
          ...reposRef.current,
          ...page.repos.filter((repo) => !currentIds.has(repo.id)),
        ];
        nextPageRef.current += 1;
        hasMoreRef.current = page.hasMore;
        cacheGithubRepos(reposRef.current, nextPageRef.current, hasMoreRef.current);
        setState((current) => ({
          ...current,
          repos: reposRef.current,
          hasMore: hasMoreRef.current,
          fromCache: false,
        }));
      }
      setState((current) => ({
        ...current,
        repos: reposRef.current,
        loading: false,
        loadingMore: false,
        hasMore: hasMoreRef.current,
        error: null,
        fromCache: false,
      }));
    } catch (error: unknown) {
      if (initial && reposRef.current.length === 0) {
        reposRef.current = fallbackRepos;
        hasMoreRef.current = false;
      }
      setState((current) => ({
        ...current,
        repos: reposRef.current,
        loading: false,
        loadingMore: false,
        hasMore: hasMoreRef.current,
        error: error instanceof Error ? error.message : 'Unable to load projects.',
        fromCache: Boolean(getCachedRepos()),
      }));
    } finally {
      requestInProgress.current = false;
    }
  }, []);

  const loadMore = useCallback(async () => {
    const targetCount = groupGithubRepos(reposRef.current).length + PROJECTS_PER_BATCH;
    await loadUntilProjectCount(targetCount);
  }, [loadUntilProjectCount]);

  useEffect(() => {
    if (!cached) void loadUntilProjectCount(PROJECTS_PER_BATCH, true);
  }, [cached, loadUntilProjectCount]);

  return { ...state, loadMore };
}

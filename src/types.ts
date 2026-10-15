export type Language = 'pt' | 'en';

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export interface ProjectConfig {
  featured: string[];
  includeForks: boolean;
  includeArchived: boolean;
  excludeRepositories: string[];
  projects: PortfolioProjectConfig[];
}

export interface PortfolioProjectConfig {
  id: string;
  title: string;
  description: string;
  repositoryNames: string[];
  technologies: string[];
  featured: boolean;
  allowForks?: boolean;
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  repositories: GithubRepo[];
  technologies: string[];
  updated_at: string;
  stargazers_count: number;
  featured: boolean;
}

export interface GithubState {
  repos: GithubRepo[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  fromCache: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

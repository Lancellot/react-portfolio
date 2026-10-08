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
}

export interface GithubState {
  repos: GithubRepo[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

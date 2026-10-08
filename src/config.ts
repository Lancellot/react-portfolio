import { ProjectConfig } from './types';

export const GITHUB_USER = 'lancellot';
export const CACHE_KEY = 'assis-github-repos';
export const CACHE_TTL = 1000 * 60 * 30;
export const projectConfig: ProjectConfig = {
  featured: ['velo', 'personal-blog'],
  includeForks: false,
  includeArchived: false,
};

export const contact = {
  email: 'assis.pires.neto@gmail.com',
  whatsapp: '5511999999999',
  linkedin: 'https://www.linkedin.com/in/assispiresneto/',
  github: `https://github.com/${GITHUB_USER}`,
  resume: '/curriculo.pdf',
};

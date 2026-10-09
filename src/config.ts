export const GITHUB_USER = 'Lancellot';
export const CACHE_KEY = 'assis-github-repos-v2';
export const CACHE_TTL = 1000 * 60 * 60;

export { projectConfig } from './projects.config';

export const contact = {
  email: 'assis.pires.netors@gmail.com',
  whatsapp: '5551997447884',
  linkedin: 'https://www.linkedin.com/in/assispiresneto/',
  github: `https://github.com/${GITHUB_USER}`,
  resume: `${process.env.PUBLIC_URL || ''}/curriculo.pdf`,
};

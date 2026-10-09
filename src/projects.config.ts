import { ProjectConfig } from './types';

// Names are normalized before matching. List every repository for each product.
export const projectConfig: ProjectConfig = {
  featured: ['vou-ali-backend-nest', 'vou-ali-react-ts-tailwind', 'ride-backend', 'ride-frontend'],
  includeForks: false,
  includeArchived: false,
  excludeRepositories: ['react-portfolio'],
  projects: [
    {
      id: 'vou-ali',
      title: 'Vou Ali',
      description:
        'Aplica\u00e7\u00e3o full stack para planejar viagens, criar roteiros, organizar paradas e acompanhar despesas.',
      repositoryNames: ['vou-ali-backend-nest', 'vou-ali-react-ts-tailwind'],
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'NestJS',
        'PostgreSQL',
        'TypeORM',
        'Tailwind CSS',
        'JWT',
        'Jest',
      ],
      featured: true,
    },
    {
      id: 'velo',
      title: 'Velo',
      description: 'Plataforma acad\u00eamica em grupo para compartilhamento de viagens.',
      repositoryNames: ['ride-backend', 'ride-frontend'],
      technologies: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Tailwind CSS', 'Jest'],
      featured: true,
      allowForks: true,
    },
  ],
};

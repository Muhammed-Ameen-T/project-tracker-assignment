import { Project, Task } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern UI/UX',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Build native mobile application for iOS and Android',
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 2024 digital marketing campaign planning and execution',
    createdAt: new Date('2024-02-01').toISOString(),
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design mockups',
    description: 'Create high-fidelity mockups for all main pages',
    status: 'Done',
    projectId: '1',
    createdAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: '2',
    title: 'Setup development environment',
    description: 'Configure Next.js project with TypeScript and Tailwind',
    status: 'Done',
    projectId: '1',
    createdAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: '3',
    title: 'Implement homepage',
    description: 'Build responsive homepage component with hero section',
    status: 'In Progress',
    projectId: '1',
    createdAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: '4',
    title: 'SEO optimization',
    description: 'Add meta tags, sitemap, and structured data',
    status: 'To Do',
    projectId: '1',
    createdAt: new Date('2024-01-19').toISOString(),
  },
  {
    id: '5',
    title: 'Setup React Native project',
    description: 'Initialize project with Expo and configure navigation',
    status: 'In Progress',
    projectId: '2',
    createdAt: new Date('2024-01-21').toISOString(),
  },
  {
    id: '6',
    title: 'Design app screens',
    description: 'Create Figma designs for all app screens',
    status: 'To Do',
    projectId: '2',
    createdAt: new Date('2024-01-22').toISOString(),
  },
  {
    id: '7',
    title: 'Content strategy',
    description: 'Define content pillars and messaging framework',
    status: 'In Progress',
    projectId: '3',
    createdAt: new Date('2024-02-02').toISOString(),
  },
  {
    id: '8',
    title: 'Social media calendar',
    description: 'Plan 3 months of social media posts',
    status: 'To Do',
    projectId: '3',
    createdAt: new Date('2024-02-03').toISOString(),
  },
];

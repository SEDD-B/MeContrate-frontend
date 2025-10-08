import type { Opportunity } from '../types/Opportunity';

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Desenvolvedor Full Stack React/Node.js',
    description: 'Precisamos de um desenvolvedor full stack para criar uma plataforma de e-commerce completa. O projeto inclui frontend em React, backend em Node.js e integração com APIs de pagamento.',
    budget: 5000,
    deadline: '2024-02-15',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express'],
    category: 'Desenvolvimento Web',
    client: 'Tech Solutions LTDA',
    duration: '2 meses',
    proposals: 12,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Designer UI/UX para App Mobile',
    description: 'Procuramos um designer experiente para criar a interface e experiência do usuário para um aplicativo de fitness. Deve incluir wireframes, protótipos e design system.',
    budget: 3200,
    deadline: '2024-02-10',
    skills: ['Figma', 'UI/UX Design', 'Prototipagem', 'Design System'],
    category: 'Design',
    client: 'HealthFit Startup',
    duration: '3 semanas',
    proposals: 8,
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Especialista em SEO e Marketing Digital',
    description: 'Necessitamos de um especialista em SEO para otimizar nosso site e aumentar o tráfego orgânico. Inclui pesquisa de palavras-chave, otimização on-page e estratégia de conteúdo.',
    budget: 2800,
    deadline: '2024-02-20',
    skills: ['SEO', 'Google Analytics', 'Marketing Digital', 'Copywriting'],
    category: 'Marketing',
    client: 'Digital Growth Agency',
    duration: '1 mês',
    proposals: 15,
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    title: 'Desenvolvedor Mobile Flutter',
    description: 'Desenvolvimento de aplicativo mobile cross-platform usando Flutter. O app será para delivery de comida com integração de mapas e pagamento.',
    budget: 6500,
    deadline: '2024-03-01',
    skills: ['Flutter', 'Dart', 'Firebase', 'APIs REST'],
    category: 'Desenvolvimento Mobile',
    client: 'FoodExpress',
    duration: '2.5 meses',
    proposals: 6,
    createdAt: '2024-01-15'
  },
  {
    id: '5',
    title: 'Copywriter para Conteúdo de Blog',
    description: 'Criação de conteúdo otimizado para SEO para blog corporativo. Serão 20 artigos sobre tecnologia e inovação. Conhecimento em TI é desejável.',
    budget: 1800,
    deadline: '2024-02-05',
    skills: ['Copywriting', 'SEO', 'Tecnologia', 'Blogging'],
    category: 'Redação',
    client: 'InovaTech Blog',
    duration: '4 semanas',
    proposals: 22,
    createdAt: '2024-01-14'
  },
  {
    id: '6',
    title: 'DevOps Engineer - AWS & Docker',
    description: 'Configuração e otimização de infraestrutura na AWS usando Docker e Kubernetes. Implementação de CI/CD pipelines e monitoramento.',
    budget: 7200,
    deadline: '2024-02-28',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    category: 'DevOps',
    client: 'CloudTech Corp',
    duration: '6 semanas',
    proposals: 9,
    createdAt: '2024-01-09'
  }
];
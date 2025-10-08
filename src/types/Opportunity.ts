export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  category: string;
  client: string;
  duration: string;
  proposals: number;
  createdAt: string;
}
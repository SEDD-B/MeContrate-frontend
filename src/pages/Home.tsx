import React, { useState } from 'react';
import OpportunityCard from '../shared/components/OpportunityCard';
import { mockOpportunities } from '../data/mockOpportunities';
import type { Opportunity } from '../types/Opportunity';

const Home: React.FC = () => {
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(new Set(mockOpportunities.map(opp => opp.category)));

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = !selectedCategory || opportunity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="page-title">Encontre Sua Próxima Oportunidade Freelance</h1>
          <p className="page-subtitle">
            Conectamos talentos excepcionais com projetos incríveis
          </p>
        </div>
      </header>

      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por habilidades, título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
            className="clear-filters"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <div className="opportunities-grid">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map(opportunity => (
            <OpportunityCard 
              key={opportunity.id} 
              opportunity={opportunity} 
            />
          ))
        ) : (
          <div className="no-results">
            <h3>Nenhuma oportunidade encontrada</h3>
            <p>Tente ajustar seus filtros de busca</p>
          </div>
        )}
      </div>

      <footer className="home-footer">
        <p>
          Mostrando {filteredOpportunities.length} de {opportunities.length} oportunidades
        </p>
      </footer>
    </div>
  );
};

export default Home;
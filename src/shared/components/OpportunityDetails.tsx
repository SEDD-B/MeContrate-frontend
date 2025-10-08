import React from 'react';
import type { Opportunity } from '../../types/Opportunity';

interface OpportunityDetailsProps {
  opportunity: Opportunity;
}

const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({ opportunity }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(opportunity.deadline);

  return (
    <div className="opportunity-details">
      {/* Header */}
      <div className="details-header">
        <div className="header-main">
          <h1 className="details-title">{opportunity.title}</h1>
          <span className="details-budget">{formatCurrency(opportunity.budget)}</span>
        </div>
        <div className="header-meta">
          <span className="client-name">{opportunity.client}</span>
          <span className="category-badge">{opportunity.category}</span>
          <span className={`deadline-badge ${daysLeft < 7 ? 'urgent' : daysLeft < 14 ? 'warning' : 'normal'}`}>
            {daysLeft} dias restantes
          </span>
        </div>
      </div>

      {/* Descrição Completa */}
      <div className="details-section">
        <h3 className="section-title">Descrição do Projeto</h3>
        <p className="details-description">{opportunity.description}</p>
      </div>

      {/* Habilidades Requeridas */}
      <div className="details-section">
        <h3 className="section-title">Habilidades Requeridas</h3>
        <div className="skills-container">
          {opportunity.skills.map((skill, index) => (
            <span key={index} className="skill-tag large">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Informações do Projeto */}
      <div className="details-grid">
        <div className="info-card">
          <span className="info-label">💼 Duração</span>
          <span className="info-value">{opportunity.duration}</span>
        </div>
        <div className="info-card">
          <span className="info-label">📅 Prazo Final</span>
          <span className="info-value">{formatDate(opportunity.deadline)}</span>
        </div>
        <div className="info-card">
          <span className="info-label">📝 Propostas</span>
          <span className="info-value">{opportunity.proposals} enviadas</span>
        </div>
        <div className="info-card">
          <span className="info-label">📊 Nível</span>
          <span className="info-value">
            {opportunity.budget > 5000 ? 'Avançado' : opportunity.budget > 2000 ? 'Intermediário' : 'Iniciante'}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="details-actions">
        <button className="btn-primary">
          🚀 Enviar Proposta
        </button>
        <button className="btn-secondary">
          💼 Salvar Oportunidade
        </button>
        <button className="btn-outline">
            ❤️ Favoritar
        </button>
      </div>
    </div>
  );
};

export default OpportunityDetails;
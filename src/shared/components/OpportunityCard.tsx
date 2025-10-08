import React, { useState } from 'react';
import type { Opportunity } from '../../types/Opportunity';
import Modal from './Modal';
import OpportunityDetails from './OpportunityDetails';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="opportunity-card">
        <div className="card-header">
          <h3 className="card-title">{opportunity.title}</h3>
          <span className="budget">{formatCurrency(opportunity.budget)}</span>
        </div>
        
        <div className="card-client">
          <span className="client-name">{opportunity.client}</span>
          <span className="category-badge">{opportunity.category}</span>
        </div>
        
        <p className="card-description">{opportunity.description}</p>
        
        <div className="skills-container">
          {opportunity.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {opportunity.skills.length > 3 && (
            <span className="skill-tag more">
              +{opportunity.skills.length - 3}
            </span>
          )}
        </div>
        
        <div className="card-footer">
          <div className="footer-info">
            <div className="info-item">
              <span className="label">Prazo:</span>
              <span className="value">{formatDate(opportunity.deadline)}</span>
            </div>
            <div className="info-item">
              <span className="label">Duração:</span>
              <span className="value">{opportunity.duration}</span>
            </div>
            <div className="info-item">
              <span className="label">Propostas:</span>
              <span className="value">{opportunity.proposals}</span>
            </div>
          </div>
          
          <button 
            className="apply-button"
            onClick={() => setIsModalOpen(true)}
          >
            Ver Detalhes
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes da Oportunidade"
      >
        <OpportunityDetails opportunity={opportunity} />
      </Modal>
    </>
  );
};

export default OpportunityCard;
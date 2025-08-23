import React from 'react';
import useDashboardData from '../../hooks/useDashboardData';

const DashboardCards: React.FC = () => {
  const { data, loading } = useDashboardData();

  const items = data ?? [];

  if (loading) {
    // show 4 skeleton cards
    return (
      <section className="cards-grid mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <article key={i} className="card glass card-metric skeleton">
            <div className="card-head">
              <div className="card-icon skeleton-circle" />
              <div style={{ flex: 1 }}>
                <div className="skeleton-line" style={{ width: '55%' }} />
                <div className="skeleton-line" style={{ width: '36%', marginTop: '8px' }} />
              </div>
            </div>
            <div className="skeleton-line" style={{ width: '80%', marginTop: '12px' }} />
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="cards-grid mt-8">
      {items.map((card) => (
        <article key={card.id} className="card glass card-metric" style={{ border: '1px solid rgba(0,255,255,0.06)' }}>
          <div className="card-head">
            <span className="card-icon" aria-hidden>
              {card.icon}
            </span>
            <div>
              <div className={`card-title ${card.color}`}>{card.title}</div>
              <div className="card-value">{card.value}</div>
            </div>
          </div>
          <div className="card-desc">{card.description}</div>
        </article>
      ))}
    </section>
  );
};

export default DashboardCards;

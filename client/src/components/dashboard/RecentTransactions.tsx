import React from 'react';
import Icon from '../../icons/iconRegistry';

type Tx = { id: string; title: string; amount: string; date: string; category?: string };

const mockTx: Tx[] = [
  { id: 't1', title: 'Cafeteria', amount: '-R$ 18,50', date: '2025-08-20', category: 'Alimentação' },
  { id: 't2', title: 'Pagamento Cliente', amount: '+R$ 2.400,00', date: '2025-08-19', category: 'Receita' },
  { id: 't3', title: 'Supermercado', amount: '-R$ 320,30', date: '2025-08-18', category: 'Supermercado' },
  { id: 't4', title: 'Assinatura', amount: '-R$ 29,90', date: '2025-08-15', category: 'Serviços' },
];

export const RecentTransactions: React.FC = () => {
  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Transações recentes</h3>
      </div>
      <ul className="recent-list">
        {mockTx.map(tx => (
          <li key={tx.id} className="transaction-item">
            <div className="tx-left">
              <div className="tx-title">{tx.title}</div>
              <div className="tx-meta">{tx.category} • {tx.date}</div>
            </div>
            <div className={`tx-amount ${tx.amount.startsWith('+') ? 'income' : 'expense'}`}>{tx.amount}</div>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
        <button className="btn-outline">Ver todas</button>
      </div>
    </div>
  );
};

export default RecentTransactions;

import React from 'react';

export const TransactionModal: React.FC = () => {
  // Modal fictício para cadastro de transação
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Nova Transação</h3>
        <form>
          <input className="w-full mb-2 p-2 border rounded" placeholder="Descrição" />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Valor" type="number" />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Categoria" />
          <button className="w-full bg-cyber-primary text-white py-2 rounded mt-2">Salvar</button>
        </form>
      </div>
    </div>
  );
};

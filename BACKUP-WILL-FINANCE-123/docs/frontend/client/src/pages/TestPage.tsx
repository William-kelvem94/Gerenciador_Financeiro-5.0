import React from 'react';

export function TestPage() {
  const testClick = () => {
    console.log('🔥 TESTE BÁSICO FUNCIONOU!');
    alert('CLIQUE FUNCIONOU!');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h1 className="text-xl font-bold mb-4 text-black">TESTE DE CLIQUES</h1>
        
        {/* Botão básico sem Framer Motion */}
        <button 
          onClick={testClick}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-4 hover:bg-blue-600"
        >
          Teste Básico
        </button>
        
        {/* Botão com event handler inline */}
        <button 
          onClick={() => {
            console.log('🔥 INLINE FUNCIONOU!');
            alert('INLINE FUNCIONOU!');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded mr-4 hover:bg-red-600"
        >
          Teste Inline
        </button>
        
        {/* Input para testar formulários */}
        <input 
          type="text" 
          placeholder="Digite algo..."
          onChange={(e) => console.log('Input:', e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded text-black"
        />
        
        {/* Form para testar submit */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            console.log('🔥 FORM SUBMIT FUNCIONOU!');
            alert('FORM SUBMIT FUNCIONOU!');
          }}
          className="mt-4"
        >
          <button 
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Teste Form Submit
          </button>
        </form>
      </div>
    </div>
  );
}

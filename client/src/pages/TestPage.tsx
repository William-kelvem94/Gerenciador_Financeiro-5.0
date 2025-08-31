import React from 'react';

export function TestPage() {
  const testClick = () => {
    console.log('🔥 TESTE BÁSICO FUNCIONOU!');
    alert('CLIQUE FUNCIONOU!');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="rounded-lg bg-white p-8">
        <h1 className="mb-4 text-xl font-bold text-black">TESTE DE CLIQUES</h1>

        {/* Botão básico sem Framer Motion */}
        <button
          onClick={testClick}
          className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Teste Básico
        </button>

        {/* Botão com event handler inline */}
        <button
          onClick={() => {
            console.log('🔥 INLINE FUNCIONOU!');
            alert('INLINE FUNCIONOU!');
          }}
          className="mr-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Teste Inline
        </button>

        {/* Input para testar formulários */}
        <input
          type="text"
          placeholder="Digite algo..."
          onChange={e => console.log('Input:', e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-black"
        />

        {/* Form para testar submit */}
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log('🔥 FORM SUBMIT FUNCIONOU!');
            alert('FORM SUBMIT FUNCIONOU!');
          }}
          className="mt-4"
        >
          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Teste Form Submit
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function CreateEnvironmentPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/environments', { name, description });
      alert('Ambiente criado com sucesso!');
      navigate('/dashboard'); 
    } catch (error) {
      console.error(error);
      alert('Erro ao criar ambiente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <Link to="/dashboard" className="text-green-400 hover:text-green-300 mb-4 block">
        &larr; Voltar para o Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-8">Criar Novo Ambiente</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4 max-w-2xl mx-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome do Ambiente</label>
          <input
            id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ex: Estufa de Tomates"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descrição (Opcional)</label>
          <textarea
            id="description" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            rows={3}
            placeholder="Ex: Cultivo hidropónico na bancada sul."
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed">
          {isLoading ? 'A Criar...' : 'Criar Ambiente'}
        </button>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/users', { name, email, password });
      alert('Utilizador registado com sucesso!');
      navigate('/'); // Redireciona para a página de login após o registo
    } catch (error) {
      console.error(error);
      alert('Erro ao registar utilizador. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Criar Conta AgriSentry</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name">Nome</label>
            <input
              id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit" disabled={isLoading}
            className="w-full py-2 px-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'A Registar...' : 'Registar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/" className="font-medium text-green-400 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
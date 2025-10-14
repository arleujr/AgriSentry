import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png'; // ✅ Importa a logo como módulo

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Falha no login:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        
        {}
        <img
          src={logo}
          alt="Logo AgriSentry"
          className="w-100 mx-auto mb-4"
        />

        <h1 className="text-2xl font-bold text-center text-gray-200">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'A Entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-green-400 hover:underline">
            Registe-se
          </Link>
        </p>
      </div>
    </div>
  );
}

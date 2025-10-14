import { createContext, useState, type ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import axios from 'axios';
import { AuthContext, type SignInCredentials, type User } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@Agrisentry:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('@Agrisentry:token');
    return storedToken ? storedToken : null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('@Agrisentry:token');
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', { email, password });
      const { user: userData, token: userToken } = response.data;

      localStorage.setItem('@Agrisentry:user', JSON.stringify(userData));
      localStorage.setItem('@Agrisentry:token', userToken);

      setUser(userData);
      setToken(userToken);

      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.error || 'Erro ao fazer login');
      }
      throw error;
    }
  }

  function signOut() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@Agrisentry:user');
    localStorage.removeItem('@Agrisentry:token');
    delete api.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
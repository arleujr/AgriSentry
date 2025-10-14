import { createContext } from 'react';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut: () => void; 
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

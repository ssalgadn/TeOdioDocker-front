"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name?: string;
  picture?: string;
  email?: string;
  sub?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const parseJwt = (token: string): User | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding JWT:", e);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const idToken = localStorage.getItem('id_token');
    if (token && idToken) {
      const userData = parseJwt(idToken);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    }
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail?.error_description || 'Error al iniciar sesión');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('id_token', data.id_token);

      const userData = parseJwt(data.id_token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
      router.push('/');

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Login error:', err.message);
        throw err;
      } else {
        console.error('Unknown login error:', err);
        throw new Error('Ocurrió un error desconocido durante el inicio de sesión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo registrar el usuario.');
      }

      await login(email, password);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Signup error:', error.message);
        throw error;
      } else {
        console.error('Unknown signup error:', error);
        throw new Error('Ocurrió un error desconocido durante el registro.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');

    setUser(null);
    setIsAuthenticated(false);

    const domain = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    const returnTo = window.location.origin; // o 'http://localhost:3000' directamente

    window.location.href = `${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
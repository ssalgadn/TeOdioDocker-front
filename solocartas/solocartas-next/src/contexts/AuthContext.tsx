"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// --- Interfaces de Tipos para TypeScript ---
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

// 1. Crear el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const parseJwt = (token: string): User | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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
    setIsLoading(false);
  }, []);

  // --- Función de Login (ACTUALIZADA CON 'audience') ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'password',
          username: email,
          password: password,
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          scope: 'openid profile email offline_access',
          // --- ¡CAMBIO CRUCIAL AQUÍ! ---
          // Se añade el parámetro 'audience' para especificar a qué API queremos acceder.
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || 'Credenciales incorrectas.');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('id_token', data.id_token);
      
      const userData = parseJwt(data.id_token);
      setUser(userData);
      setIsAuthenticated(true);

      router.push('/profile');
    } catch (error: any) {
        throw error; // Relanzamos el error para que la página lo pueda capturar
    } finally {
        setIsLoading(false);
    }
  };

  // --- Función de Signup (no cambia, pero ahora llamará a la función de login corregida) ---
  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/dbconnections/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
          email,
          password,
          connection: 'Username-Password-Authentication',
          user_metadata: { username }
        }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(errorData.description || 'No se pudo crear la cuenta.');
      }

      await login(email, password); // Llama a la nueva función de login con 'audience'
    } catch(error: any) {
        throw error; // Relanzamos el error
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => { /* ... (sin cambios) ... */ };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom hook para usar el contexto ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, Auth } from 'firebase/auth';
import { app, db, auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Firestore } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  auth: Auth; 
  db: Firestore;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  auth: auth,
  db: db,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  if (loading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, auth, db }}>
      {children}
    </AuthContext.Provider>
  );
};

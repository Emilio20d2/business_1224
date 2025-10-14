
"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, Auth, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  auth: Auth; 
  db: Firestore;
}

// Initialize with placeholder values that will be replaced.
const initialAuth = {} as Auth;
const initialDb = {} as Firestore;

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  auth: initialAuth,
  db: initialDb,
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseInstances, setFirebaseInstances] = useState<{ auth: Auth; db: Firestore } | null>(null);

  useEffect(() => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    });
    const dbInstance = getFirestore(app);
    setFirebaseInstances({ auth: authInstance, db: dbInstance });

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    if (!firebaseInstances) throw new Error("Firebase no inicializado");
    return signInWithEmailAndPassword(firebaseInstances.auth, email, pass);
  };

  const logout = async () => {
    if (!firebaseInstances) throw new Error("Firebase no inicializado");
    await signOut(firebaseInstances.auth);
  };
  
  if (loading || !firebaseInstances) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, auth: firebaseInstances.auth, db: firebaseInstances.db }}>
      {children}
    </AuthContext.Provider>
  );
};


"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, Auth, getAuth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Firestore, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase'; // Import the initialized app

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  auth: Auth | null; 
  db: Firestore | null;
  firebaseInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  auth: null,
  db: null,
  firebaseInitialized: false,
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [dbInstance, setDbInstance] = useState<Firestore | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    try {
        const auth = getAuth(app);
        const db = getFirestore(app);
    
        setAuthInstance(auth);
        setDbInstance(db);
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
          // Mark Firebase as fully initialized only after the first auth check.
          if (!firebaseInitialized) {
            setFirebaseInitialized(true);
          }
        });

        return () => unsubscribe();
    } catch(e) {
        console.error("Firebase initialization error", e);
        setLoading(false);
        setFirebaseInitialized(true); // Still mark as initialized to prevent infinite loading on error
    }
  }, [firebaseInitialized]); // Dependency added to prevent re-running this effect unnecessarily

  const login = (email: string, pass: string) => {
    if (!authInstance) throw new Error("Firebase Auth no inicializado");
    return signInWithEmailAndPassword(authInstance, email, pass);
  };

  const logout = async () => {
    if (!authInstance) throw new Error("Firebase Auth no inicializado");
    await signOut(authInstance);
  };
  
  const value = {
      user,
      loading,
      login,
      logout,
      auth: authInstance,
      db: dbInstance,
      firebaseInitialized
  };

  if (!firebaseInitialized || loading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Inicializando Conexión...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  User,
  Auth
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      // onAuthStateChanged will handle setting the user and updating loading state.
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup closed by user.');
      } else if (error.code === 'auth/popup-blocked') {
         toast({
          variant: 'destructive',
          title: 'Popup Blocked',
          description: 'Please allow popups for this site to sign in.',
        });
      }
      else {
        console.error("Sign-in error:", error);
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || 'An unknown error occurred.',
        });
      }
      // Set loading to false on error to unblock UI
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
      setUser(null);
    } catch (error: any) {
      console.error("Sign-out error:", error);
       toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: error.message || 'An unknown error occurred.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

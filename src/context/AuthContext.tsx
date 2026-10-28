import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types/study';

interface AuthContextValue {
  user: UserSession | null;
  signInWithCredentials: (email: string, password: string, name?: string) => void;
  signInWithGoogle: () => void;
  logout: () => void;
}

const SESSION_STORAGE_KEY = 'study_retrieval_session_v3';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as UserSession;
      }
    } catch {
      // Ignore corrupted local storage
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem('active_jwt_v3', user.token);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem('active_jwt_v3');
    }
  }, [user]);

  const signInWithCredentials = (email: string, _password: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase() || 'alex.rivera@stanford.edu';
    const derivedName =
      name?.trim() ||
      cleanEmail
        .split('@')[0]
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    const newSession: UserSession = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      email: cleanEmail,
      name: derivedName || 'Alex Rivera',
      role: 'Undergraduate Researcher',
      institution: cleanEmail.includes('.edu') ? cleanEmail.split('@')[1].toUpperCase() : 'University Workspace',
      provider: 'credentials',
      token: `jwt_v3_${btoa(cleanEmail)}_${Date.now()}`,
      signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUser(newSession);
  };

  const signInWithGoogle = () => {
    const newSession: UserSession = {
      id: 'usr_google_982341',
      email: 'alex.rivera@stanford.edu',
      name: 'Alex Rivera',
      role: 'B.S. Honors Candidate',
      institution: 'STANFORD.EDU',
      provider: 'google',
      token: `oauth2_google_v3_${Date.now()}_secure`,
      signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUser(newSession);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem('active_jwt_v3');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signInWithCredentials, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

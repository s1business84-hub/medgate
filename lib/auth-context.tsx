"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, loginUser, logoutUser, createUser, getUsers, getStudents, getApplications, getStaffAlerts } from '@/lib/storage';
import { mockUsers, mockStudents, mockApplications, mockStaffAlerts } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  /**
   * True until the initial client-side check of stored auth state resolves.
   * Every protected page reads this before deciding to redirect — `user`
   * starts as null on every mount (SSR has no localStorage), so a page that
   * redirects the instant `user` is null bounces already-logged-in staff
   * and students to the login screen on every fresh load or refresh.
   */
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to initialize demo data in localStorage
function initializeDemoData() {
  if (typeof window === 'undefined') return;
  
  // Initialize users
  const existingUsers = getUsers();
  if (existingUsers.length === 0) {
    mockUsers.forEach(user => createUser(user));
  }
  
  // Initialize students
  const existingStudents = getStudents();
  if (existingStudents.length === 0) {
    const studentsKey = "electivio_students";
    window.localStorage.setItem(studentsKey, JSON.stringify(mockStudents));
  }
  
  // Initialize applications
  const existingApplications = getApplications();
  if (existingApplications.length === 0) {
    const applicationsKey = "electivio_applications";
    window.localStorage.setItem(applicationsKey, JSON.stringify(mockApplications));
  }
  
  // Initialize staff alerts
  const existingAlerts = getStaffAlerts();
  if (existingAlerts.length === 0) {
    const alertsKey = "electivio_staff_alerts";
    window.localStorage.setItem(alertsKey, JSON.stringify(mockStaffAlerts));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize demo data and load current user on client-side only
    initializeDemoData();
    const currentUser = getCurrentUser();
    queueMicrotask(() => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const login = (email: string, password: string): boolean => {
    const loggedInUser = loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
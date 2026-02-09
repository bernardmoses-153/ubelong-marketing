"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  api,
  authApi,
  type UserProfile,
  type LoginRequest,
  type ApiError
} from '@/lib/api';
import {
  setTokens,
  clearTokens,
  getAccessToken,
  setUser,
  getUser,
  type StoredUser,
} from '@/lib/auth';

interface AuthContextType {
  user: StoredUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const storedUser = getUser();

      if (token && storedUser) {
        api.setToken(token);
        setUserState(storedUser);

        // Verify token is still valid
        try {
          const profile = await authApi.me();
          const updatedUser: StoredUser = {
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            role: profile.role,
            avatar_url: profile.avatar_url,
          };
          setUser(updatedUser);
          setUserState(updatedUser);
        } catch {
          // Token invalid, clear auth
          clearTokens();
          api.setToken(null);
          setUserState(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);

      // Check if user is a doctor
      if (response.user.role !== 'doctor' && response.user.role !== 'admin') {
        throw { message: 'Access denied. Only doctors can access this portal.', status: 403 };
      }

      // Store tokens and user
      setTokens(response.access_token, response.refresh_token);
      api.setToken(response.access_token);

      const storedUser: StoredUser = {
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        role: response.user.role,
        avatar_url: response.user.avatar_url,
      };

      setUser(storedUser);
      setUserState(storedUser);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      clearTokens();
      api.setToken(null);
      setUserState(null);
      router.push('/login');
    }
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
        clearError,
      }}
    >
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

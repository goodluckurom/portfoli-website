"use client";

import { create } from "zustand";
import { User } from "@prisma/client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/auth/session', {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }

      const data = await response.json();
      set({ 
        user: data.user, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ 
        user: null, 
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to check auth"
      });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/auth/login', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      set({ 
        user: data.user,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Login error:", error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to login"
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/auth/logout', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      set({ 
        user: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Logout error:", error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to logout"
      });
      throw error;
    }
  },
}));

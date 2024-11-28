"use client";

import { create } from "zustand";
import { User } from "@prisma/client";
import { useEffect } from "react";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => {
  // Check auth status on initialization
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        set({ user: null, isLoading: false });
        return;
      }

      const data = await response.json();
      if (data.user) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ user: null, isLoading: false });
    }
  };

  // Call checkAuth immediately
  checkAuth();

  return {
    user: null,
    isLoading: true,
    error: null,

    setUser: (user) => set({ user }),

    login: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to login");
        }

        const data = await response.json();
        set({ user: data.user, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to login",
          isLoading: false,
        });
      }
    },

    logout: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to logout");
        }

        set({ user: null, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to logout",
          isLoading: false,
        });
      }
    },

    checkAuth,
  };
});

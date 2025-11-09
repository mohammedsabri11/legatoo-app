"use client";
/* eslint-disable */
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  SignupData,
  LoginData,
  ForgotPasswordData,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authUtils, getDefaultRouteForRole } from "@/lib/auth-utils";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// Signup mutation
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupData) => {
      console.log("🔄 Signup mutation triggered with data:", data);
      return authApi.signup(data);
    },
    onSuccess: (response) => {
      console.log("✅ Signup success:", response);
      if (response.success) {
        // Store user data and profile

        // Show success toast
        toast.success(response.message);

        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }
    },
    onError: (error) => {
      console.error("❌ Signup error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
    },
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      return authApi.login(data);
      // Simulate network delay
    },
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const { user } = response.data;
        
        // Store user data and profile
        authUtils.storeUserData(response.data.user, response.data.profile);

        // Store tokens
        authUtils.storeTokens(
          response.data.access_token,
          response.data.refresh_token,
          response.data.expires_in
        );

        // Update auth state in React Query
        queryClient.setQueryData(authKeys.user(), user);

        // Show toast
        toast.success("Login successful! Welcome back!");

        // Redirect after login - using replace to avoid back button issues
        const urlParams = new URLSearchParams(window.location.search);
        const defaultRoute = getDefaultRouteForRole(
          (user.role as "super_admin" | "admin" | "user") || "user"
        );
        const redirectTo = urlParams.get("redirect") || defaultRoute;

        // Use window.location for immediate redirect
        window.location.href = redirectTo;
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    },
  });
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => {
      console.log("🔄 Forgot Password mutation triggered with data:", data);
      return authApi.forgotPassword(data);
    },
    onSuccess: (response) => {
      console.log("✅ Forgot password success:", response);
      toast.success("Password reset email sent! Check your inbox.");
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      toast.error(
        error.message || "Failed to send reset email. Please try again."
      );
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      console.log("🔄 Logout mutation triggered");
      return authApi.logout();
    },
    onSuccess: () => {
      localStorage.removeItem("dashboard-expanded-sections");
      // Clear all authentication data
      authUtils.clearAuth();

      // Clear query cache
      queryClient.clear();

      // Show success toast
      toast.success("Logged out successfully!");

      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1000);
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    },
  });
}

// Get current user hook
export function useUser() {
  const queryClient = useQueryClient();

  // Try to get user from localStorage first
  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  return queryClient.getQueryData(authKeys.user()) || getUserFromStorage();
}

// Get current profile hook
export function useProfile() {
  const queryClient = useQueryClient();

  // Try to get profile from localStorage first
  const getProfileFromStorage = () => {
    if (typeof window !== "undefined") {
      const profile = localStorage.getItem("profile");
      return profile ? JSON.parse(profile) : null;
    }
    return null;
  };

  return (
    queryClient.getQueryData(authKeys.profile()) || getProfileFromStorage()
  );
}

// Hook for automatic token refresh management
export function useTokenRefresh() {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start automatic token refresh timer
    refreshTimerRef.current = authUtils.startTokenRefreshTimer();

    return () => {
      // Clean up timer on unmount
      if (refreshTimerRef.current) {
        authUtils.stopTokenRefreshTimer(refreshTimerRef.current);
      }
    };
  }, []);

  return {
    startRefresh: () => {
      if (!refreshTimerRef.current) {
        refreshTimerRef.current = authUtils.startTokenRefreshTimer();
      }
    },
    stopRefresh: () => {
      if (refreshTimerRef.current) {
        authUtils.stopTokenRefreshTimer(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }
  };
}

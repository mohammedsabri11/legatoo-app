"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { authUtils } from "@/lib/auth-utils";
import toast from "react-hot-toast";

// Query keys for profile management
export const profileKeys = {
  all: ["profile"] as const,
  profile: () => [...profileKeys.all, "profile"] as const,
  notifications: () => [...profileKeys.all, "notifications"] as const,
  privacy: () => [...profileKeys.all, "privacy"] as const,
};

// Profile data interface
export interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  account_type: string;
  email?: string;
  location?: string;
  created_at?: string;
  last_login?: string;
}

// Password change interface
export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Notifications interface
export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  weekly_reports: boolean;
  security_alerts: boolean;
}

// Privacy settings interface
export interface PrivacySettings {
  profile_visibility: string;
  show_email: boolean;
  show_phone: boolean;
  show_location: boolean;
  allow_direct_messages: boolean;
}

// Hook for fetching profile data
export function useProfileData() {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: async () => {
      const response = await authApi.getProfile();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch profile");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook for updating profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProfileData>) => authApi.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        // Update the profile in localStorage
        const currentProfile = authUtils.getProfile();
        if (currentProfile && response.data && typeof response.data === 'object') {
          const updatedProfile = { ...currentProfile, ...(response.data as Partial<ProfileData>) };
          localStorage.setItem("profile", JSON.stringify(updatedProfile));
        }

        // Invalidate and refetch profile data
        queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
        
        toast.success(response.message || "Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    },
    onError: (error: Error) => {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    },
  });
}

// Hook for changing password
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeData) => authApi.changePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Password changed successfully!");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    },
    onError: (error: Error) => {
      console.error("Password change error:", error);
      toast.error(error.message || "Failed to change password");
    },
  });
}

// Hook for updating notifications
export function useUpdateNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => authApi.updateNotifications(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: profileKeys.notifications() });
        toast.success(response.message || "Notification settings updated!");
      } else {
        toast.error(response.message || "Failed to update notification settings");
      }
    },
    onError: (error: Error) => {
      console.error("Notification update error:", error);
      toast.error(error.message || "Failed to update notification settings");
    },
  });
}

// Hook for updating privacy settings
export function useUpdatePrivacy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PrivacySettings>) => authApi.updatePrivacy(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: profileKeys.privacy() });
        toast.success(response.message || "Privacy settings updated!");
      } else {
        toast.error(response.message || "Failed to update privacy settings");
      }
    },
    onError: (error: Error) => {
      console.error("Privacy update error:", error);
      toast.error(error.message || "Failed to update privacy settings");
    },
  });
}

// Main profile management hook that combines all functionality
export function useProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications" | "privacy">("profile");

  // Form states
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    weekly_reports: true,
    security_alerts: true,
  });
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: "team",
    show_email: true,
    show_phone: false,
    show_location: true,
    allow_direct_messages: true,
  });

  // Fetch profile data
  const { data: profile, isLoading, error } = useProfileData();

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const updateNotificationsMutation = useUpdateNotifications();
  const updatePrivacyMutation = useUpdatePrivacy();

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        location: profile.location,
      });
    }
  }, [profile]);

  // Form handlers
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: string | boolean) => {
    setPrivacy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save handlers
  const handleSaveProfile = () => {
    if (formData) {
      updateProfileMutation.mutate(formData);
      setIsEditing(false);
    }
  };

  const handleSavePassword = () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    changePasswordMutation.mutate(passwordData);
    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  const handleSaveNotifications = () => {
    updateNotificationsMutation.mutate(notifications);
  };

  const handleSavePrivacy = () => {
    updatePrivacyMutation.mutate(privacy);
  };

  // Validation helpers
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(passwordData.new_password);

  return {
    // State
    isEditing,
    setIsEditing,
    showPassword,
    setShowPassword,
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    isLoading,
    error,
    formData,
    passwordData,
    notifications,
    privacy,
    
    // Handlers
    handleInputChange,
    handlePasswordChange,
    handleNotificationChange,
    handlePrivacyChange,
    handleSaveProfile,
    handleSavePassword,
    handleSaveNotifications,
    handleSavePrivacy,
    
    // Validation
    passwordValidation,
    
    // Loading states
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUpdatingNotifications: updateNotificationsMutation.isPending,
    isUpdatingPrivacy: updatePrivacyMutation.isPending,
  };
}

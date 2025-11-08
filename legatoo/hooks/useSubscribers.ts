import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { subscribersApi, Subscriber, SubscriberDetail, CreateSubscriberData, UpdateSubscriberData } from "@/lib/api/subscribers";

export const subscriberKeys = {
  all: ["subscribers"] as const,
  lists: () => [...subscriberKeys.all, "list"] as const,
  list: (filters: { skip?: number; limit?: number } = {}) =>
    [...subscriberKeys.lists(), filters] as const,
  details: () => [...subscriberKeys.all, "detail"] as const,
  detail: (id: string) => [...subscriberKeys.details(), id] as const,
};

export function useSubscribers(skip: number = 0, limit: number = 100) {
  return useQuery({
    queryKey: subscriberKeys.list({ skip, limit }),
    queryFn: async () => {
      const response = await subscribersApi.getAll(skip, limit);
      if (response.success && response.data) {
        return response.data.subscribers;
      }
      throw new Error(response.message || "Failed to fetch subscribers");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSubscriber(subscriptionId: string | null) {
  return useQuery({
    queryKey: subscriberKeys.detail(subscriptionId || ""),
    queryFn: async () => {
      if (!subscriptionId) return null;
      const response = await subscribersApi.getById(subscriptionId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch subscriber");
    },
    enabled: !!subscriptionId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubscriberData) => {
      return subscribersApi.create(data);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: subscriberKeys.lists() });
        toast.success("Subscriber created successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create subscriber");
    },
  });
}

export function useUpdateSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      data,
    }: {
      subscriptionId: string;
      data: UpdateSubscriberData;
    }) => {
      return subscribersApi.update(subscriptionId, data);
    },
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: subscriberKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: subscriberKeys.detail(variables.subscriptionId),
        });
        toast.success("Subscriber updated successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update subscriber");
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      return subscribersApi.delete(subscriptionId);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: subscriberKeys.lists() });
        toast.success("Subscriber deleted successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete subscriber");
    },
  });
}

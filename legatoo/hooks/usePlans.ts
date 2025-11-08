import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { plansApi, Plan, CreatePlanData } from "@/lib/api/plans";

export const planKeys = {
  all: ["plans"] as const,
  lists: () => [...planKeys.all, "list"] as const,
  list: (active_only?: boolean) =>
    [...planKeys.lists(), active_only] as const,
};

export function usePlans(active_only: boolean = false) {
  return useQuery({
    queryKey: planKeys.list(active_only),
    queryFn: async () => {
      const response = await plansApi.getAll(active_only);
      if (response.success && response.data) {
        return response.data.plans;
      }
      throw new Error(response.message || "Failed to fetch plans");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePlanData) => {
      return plansApi.create(data);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: planKeys.lists() });
        toast.success("Plan created successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create plan");
    },
  });
}


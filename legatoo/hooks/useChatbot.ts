import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  answer?: string;
}

export function useSearchSimilarLaws() {
  return useMutation({
    mutationFn: (params: {
      query: string;
      document_id?: number;
      top_k?: number;
    }) => authApi.searchSimilarLaws(params),
  });
}


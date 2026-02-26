import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ScanInput, ScanResponse, HistoryResponse } from "../types/api";

const API_BASE = "http://localhost:8000";

export function useScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScanInput): Promise<ScanResponse> => {
      const res = await fetch(`${API_BASE}/scan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.message || "Failed to scan. Is the backend running?");
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate history to show the new scan
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useHistory(limit: number = 50) {
  return useQuery({
    queryKey: ["history", limit],
    queryFn: async (): Promise<HistoryResponse> => {
      const res = await fetch(`${API_BASE}/history/?limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch history");
      }
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

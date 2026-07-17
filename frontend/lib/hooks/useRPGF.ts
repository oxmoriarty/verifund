"use client";

import { TransactionStatus } from "genlayer-js/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getClient } from "../genlayer/client";
import { useWallet } from "../genlayer/wallet";
import { success, error } from "../utils/toast";

export interface Project {
  url: string;
  summary: string;
  score?: number; // Parsed from summary if JSON
  status: "PENDING" | "ACCEPTED" | "FINALIZED";
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address is not configured");
      }

      // Live integration logic
      try {
        const client = await getClient();
        const projects: any = await client.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_all_projects",
          args: [],
        });
        
        return projects.map((p: any) => ({
          url: p.url,
          summary: p.summary,
          status: "FINALIZED"
        }));
      } catch (err) {
        console.error("Error fetching projects from GenLayer:", err);
        throw err;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}

export function useProjectCount() {
  const { data: projects } = useProjects();
  return projects?.length || 0;
}

export function useSubmitProject() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState<"IDLE" | "PENDING" | "ACCEPTED" | "FINALIZED">("IDLE");

  const mutation = useMutation({
    mutationFn: async ({ projectUrl, description }: { projectUrl: string; description: string }) => {
      if (!address) {
        throw new Error("Wallet not connected. Please connect your wallet to submit a project.");
      }
      
      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address is not configured.");
      }

      setIsSubmitting(true);
      setTxStatus("PENDING");

      const client = await getClient();
      
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "submit_project",
        args: [projectUrl, description],
        value: BigInt(0),
      });

      setTxStatus("ACCEPTED");

      const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
        status: TransactionStatus.ACCEPTED,
        retries: 24,
        interval: 5000,
      });

      setTxStatus("FINALIZED");
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsSubmitting(false);
      setTxStatus("IDLE");
      success("Project Submitted Successfully!", {
        description: "The AI agent has evaluated and stored your project on GenLayer."
      });
    },
    onError: (err: any) => {
      console.error("Error submitting project:", err);
      setIsSubmitting(false);
      setTxStatus("IDLE");
      error("Submission Failed", {
        description: err?.message || "An error occurred while evaluating the project."
      });
    },
  });

  return {
    ...mutation,
    isSubmitting,
    txStatus,
    submitProject: mutation.mutate,
    submitProjectAsync: mutation.mutateAsync,
  };
}

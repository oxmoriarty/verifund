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

// Fallback placeholder address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Mock Data for Development
const MOCK_PROJECTS: Project[] = [
  {
    url: "https://github.com/ethereum/solidity",
    summary: JSON.stringify({ score: 9.8, summary: "Core infrastructure for Ethereum. Critical public good." }),
    status: "FINALIZED"
  },
  {
    url: "https://optimism.io",
    summary: JSON.stringify({ score: 9.5, summary: "L2 scaling solution with deep commitment to retroactive funding." }),
    status: "FINALIZED"
  },
  {
    url: "https://ethglobal.com",
    summary: JSON.stringify({ score: 8.9, summary: "Fostering developer ecosystems globally via hackathons." }),
    status: "FINALIZED"
  }
];

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      // Return realistic mock data when no real contract is deployed
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        return Promise.resolve(MOCK_PROJECTS);
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
        return MOCK_PROJECTS; // fallback to mock data on error
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

      setIsSubmitting(true);
      setTxStatus("PENDING");

      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // Mock submission delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTxStatus("ACCEPTED");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTxStatus("FINALIZED");
        
        // Add to local mock data
        MOCK_PROJECTS.unshift({
          url: projectUrl,
          summary: JSON.stringify({ score: 8.5, summary: `Newly submitted project evaluation for ${description}` }),
          status: "FINALIZED"
        });
        return { hash: "0xmocktxhash" };
      }

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

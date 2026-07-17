"use client";

import { useState } from "react";
import { Project } from "@/lib/hooks/useRPGF";
import { ExternalLink, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  let parsedSummary = { score: 0, summary: "No summary available." };
  let isJson = false;

  try {
    const data = JSON.parse(project.summary);
    if (data.score !== undefined && data.summary !== undefined) {
      parsedSummary = data;
      isJson = true;
    }
  } catch (e) {
    parsedSummary.summary = project.summary;
  }

  const score = isJson ? parsedSummary.score : project.score || 0;
  
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-6 rounded-2xl transition-all duration-200 ease-out hover:bg-white/10 hover:-translate-y-1 hover:border-emerald-500/50 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
              {score > 0 ? `Score: ${score.toFixed(1)}` : "Unscored"}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">
              {project.status === "FINALIZED" ? "Verified" : "Pending"}
            </span>
          </div>
          
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold tracking-tight flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-xs font-medium text-white/60 hover:text-white transition-all duration-200 ease-out active:scale-95"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Consensus Report
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <div className="mt-4 bg-black/40 rounded-lg p-4 border border-white/5 text-xs text-white/70 leading-relaxed font-mono">
            {parsedSummary.summary}
            <div className="mt-4 flex items-center gap-2 text-white/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
              Evaluated by GenLayer validator consensus
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

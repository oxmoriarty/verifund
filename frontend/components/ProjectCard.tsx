"use client";

import { useState } from "react";
import { Project } from "@/lib/hooks/useRPGF";
import { ExternalLink, ChevronDown, ChevronUp, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse summary JSON if possible
  let parsedSummary = { score: 0, summary: "No summary available." };
  let isJson = false;

  try {
    const data = JSON.parse(project.summary);
    if (data.score !== undefined && data.summary !== undefined) {
      parsedSummary = data;
      isJson = true;
    }
  } catch (e) {
    // If not JSON, use the raw string
    parsedSummary.summary = project.summary;
  }

  // Determine impact class and badge styling based on score
  const score = isJson ? parsedSummary.score : project.score || 0;
  let impactClass = "Standard";
  let badgeColors = "bg-slate-500/10 text-slate-400 border-slate-500/20";
  let glowColor = "";

  if (score >= 9.0) {
    impactClass = "Alpha";
    badgeColors = "bg-primary/10 text-primary border-primary/20";
    glowColor = "shadow-[0_0_20px_rgba(133,23,255,0.15)]";
  } else if (score >= 8.0) {
    impactClass = "Beta";
    badgeColors = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    glowColor = "shadow-[0_0_15px_rgba(59,130,246,0.1)]";
  } else if (score >= 6.0) {
    impactClass = "Gamma";
    badgeColors = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }

  return (
    <div className={`glass-card p-6 transition-all duration-300 hover:-translate-y-1 ${glowColor} group`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold tracking-wide flex items-center gap-1.5 ${badgeColors}`}>
              {score >= 9.0 && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              {score > 0 ? `Score: ${score.toFixed(1)}/10` : "Unscored"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              project.status === "FINALIZED" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
            }`}>
              {project.status === "FINALIZED" ? "Verified" : "Pending"}
            </span>
          </div>
          
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold truncate block hover:text-primary transition-colors flex items-center gap-2"
          >
            {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-foreground/80">Class</div>
          <div className={`text-xl font-bold tracking-tight ${score >= 9.0 ? 'text-primary' : 'text-muted-foreground'}`}>
            {impactClass}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group/btn"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            AI Consensus Report
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
          )}
        </button>

        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-sm text-foreground/90 leading-relaxed font-mono">
              {parsedSummary.summary}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Evaluated by GenLayer validator consensus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

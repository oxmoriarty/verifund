"use client";

import { useProjects } from "@/lib/hooks/useRPGF";
import { ProjectForm } from "@/components/ProjectForm";
import { ProjectCard } from "@/components/ProjectCard";
import { Navbar } from "@/components/Navbar";
import { Loader2, Box, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      <Navbar />

      <main className="pt-28 pb-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center md:text-left md:flex justify-between items-end gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Verifund Protocol v1.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Retroactive Public Goods <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Funding.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Verifund uses GenLayer's Intelligent Contracts to autonomously evaluate, score, and fund public good projects across the decentralized web.
            </p>
          </div>
          
          <div className="hidden md:flex gap-4 mt-8 md:mt-0">
            <div className="glass-card px-6 py-4 rounded-2xl border-primary/20">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Total Volume</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">1.2M <span className="text-primary text-xl">GEN</span></div>
            </div>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <ProjectForm />
            
            <div className="glass-card p-6 hidden lg:block">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" />
                How it works
              </h3>
              <ol className="space-y-4 text-sm text-muted-foreground relative pl-4 border-l border-white/10 ml-2">
                <li className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary/50 border-2 border-background" />
                  <strong className="text-foreground">Submit</strong>: Enter a project URL.
                </li>
                <li className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500/50 border-2 border-background" />
                  <strong className="text-foreground">Evaluate</strong>: Validators scrape and rate impact via LLM consensus.
                </li>
                <li className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500/50 border-2 border-background" />
                  <strong className="text-foreground">Fund</strong>: High-scoring projects receive GEN automatically.
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column: Project Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-tight">Project Directory</h2>
              <span className="text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {projects?.length || 0} Registered
              </span>
            </div>

            {isLoading ? (
              <div className="glass-card h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Syncing state from GenLayer...</p>
              </div>
            ) : error ? (
              <div className="glass-card h-64 flex flex-col items-center justify-center text-destructive border-destructive/20">
                <p className="font-semibold">Failed to load projects</p>
                <p className="text-sm opacity-80 mt-1">{error.message}</p>
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="glass-card h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
                <Box className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-semibold text-foreground/80">No projects found</p>
                <p className="text-sm mt-1">Be the first to submit a public good.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((project, idx) => (
                  <ProjectCard key={`${project.url}-${idx}`} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
